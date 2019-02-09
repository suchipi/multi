import createServer from "little-api/server";
import WebSocket from "ws";
import debug from "debug";
import uid from "uid";
import deepEqual from "deep-equal";
import {
  initialState,
  reducer,
  Action,
  ClientMessage,
  ServerMessage,
  ClientID,
} from "@multi/game-state";
import Snapshot from "./Snapshot";
import RollingQueue from "./RollingQueue";
import Client from "./Client";
import validateMessage from "./validateMessage";

const log = debug("@multi/net-server");

export default function netServer() {
  const snapshots: RollingQueue<Snapshot> = new RollingQueue(32);
  snapshots.add(new Snapshot(initialState()));

  const clients: Set<Client> = new Set();

  const dispatch = (action: Action) => {
    log(`server dispatched action: ${JSON.stringify(action)}`);
    const lastState = snapshots.mostRecent().state;
    const nextState = reducer(snapshots.mostRecent().state, action);
    if (!deepEqual(lastState, nextState, { strict: true })) {
      const snapshot = new Snapshot(nextState);
      log(`created snapshot ${snapshot.id}`);
      snapshots.add(snapshot);
    }
  };

  const server = createServer({
    methods: {
      createId(): ClientID {
        // @ts-ignore typedef is wrong
        return uid(16);
      },
    },
    socketMethods: {
      connect(socket: WebSocket, id: ClientID) {
        let client: Client;
        const existingClient = Array.from(clients).find(
          (someClient) => someClient.id === id
        );
        if (existingClient) {
          client = existingClient;
          client.socket = socket;
          client.lastReceivedSnapshot = null;
          clearTimeout(client.leaveTimeout);
        } else {
          client = new Client(id, socket);
          clients.add(client);
          dispatch({ type: "PLAYER_JOIN", clientId: client.id });
        }

        log(`client ${client.id} connected`);

        socket.on("close", () => {
          log(`client ${client.id} disconnected`);
          client.leaveTimeout = setTimeout(() => {
            clients.delete(client);
            dispatch({ type: "PLAYER_LEAVE", clientId: client.id });
          }, 30000);
        });

        socket.on("pong", () => {
          client.updateLastSeenAt();
        });

        socket.on("message", (json: string) => {
          const message: ClientMessage = JSON.parse(json);
          try {
            receiveMessage(client, message);
          } catch (err) {
            log(`error while procesing client message: ${err.stack}`);
          }
        });
      },
    },
  });

  // Called when we receive a message from a client
  function receiveMessage(client: Client, message: ClientMessage) {
    client.updateLastSeenAt();

    const isValid = validateMessage(client, message);
    if (!isValid) {
      return;
    }

    switch (message.type) {
      case "ack": {
        log(`client ${client.id} acked snapshot ${message.snapshotId}`);
        client.lastReceivedSnapshot = snapshots.find(
          (snapshot) => snapshot.id === message.snapshotId
        );
        break;
      }
      case "action": {
        const action = message.action;
        log(`client ${client.id} sent action: ${JSON.stringify(action)}`);

        dispatch(action);
        const ack: ServerMessage = {
          type: "ack",
          actionId: message.actionId,
        };
        client.addMessageToQueue(ack);
        break;
      }
    }
  }

  // Every 16ms, process the next gamestate snapshot, then send it to players
  const tickrate = 16;
  setInterval(() => {
    clients.forEach((client) => {
      const mostRecentSnapshot = snapshots.mostRecent();
      if (client.lastReceivedSnapshot !== mostRecentSnapshot) {
        // TODO: we know the last snapshot they received,
        // so we could theoretically send a subset of the state
        // instead of the whole thing.
        log(`sending snapshot ${mostRecentSnapshot.id} to client ${client.id}`);
        const message: ServerMessage = {
          type: "snapshot",
          snapshotId: mostRecentSnapshot.id,
          state: mostRecentSnapshot.state,
        };
        client.addMessageToQueue(message);
      }

      client.flushQueue();
    });
  }, tickrate);

  // Every second, ping all clients, and also, remove clients
  // that haven't ponged back.
  const pingrate = 1000;
  setInterval(() => {
    clients.forEach((client) => {
      if (Date.now() - client.lastSeenAt > pingrate * 2) {
        log(`client ${client.id} lost connection`);
        client.socket.terminate();
        return;
      }
      try {
        client.socket.ping();
      } catch (err) {
        // ignored
      }
    });
  }, pingrate);

  return server;
}
