import createServer from "little-api/server";
import WebSocket from "ws";
import debug from "debug";
import uid from "uid";
import { initialState, reducer } from "@multi/game-state";
import { ClientMessage, ServerMessage, ClientID } from "@multi/net-protocol";
import Snapshot from "./Snapshot";
import RollingQueue from "./RollingQueue";
import Client from "./Client";

const log = debug("@multi/net-server");

export default function netServer() {
  const snapshots: RollingQueue<Snapshot> = new RollingQueue(32);
  snapshots.add(new Snapshot(initialState()));

  const clients: Set<Client> = new Set();

  const server = createServer({
    methods: {
      createId(): ClientID {
        return uid(16);
      },
    },
    socketMethods: {
      connect(socket: WebSocket, id: ClientID) {
        let client;
        const existingClient = Array.from(clients).find(
          (someClient) => someClient.id === id
        );
        if (existingClient) {
          client = existingClient;
          client.socket = socket;
          clearTimeout(client.leaveTimeout);
        } else {
          client = new Client(id, socket);
          clients.add(client);
        }

        log(`client ${client.id} connected`);

        socket.on("close", () => {
          log(`client ${client.id} disconnected`);
          client.leaveTimeout = setTimeout(() => {
            clients.delete(client);
          }, 30000);
        });

        socket.on("pong", () => {
          client.lastSeenAt = Date.now();
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

        const snapshot = new Snapshot(
          reducer(snapshots.mostRecent().state, action)
        );
        log(`created snapshot ${snapshot.id}`);
        snapshots.add(snapshot);
        const ack: ServerMessage = {
          type: "ack",
          actionId: message.actionId,
        };
        client.addMessageToQueue(ack);
        break;
      }
    }
  }

  // Every 33ms, check for clients that haven't
  // acked the latest snapshot and send it to them
  const tickrate = 33;
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

  // Every 5 sec, ping all clients, and also, remove clients
  // that haven't ponged back.
  const pingrate = 5000;
  const noop = () => {};
  setInterval(() => {
    clients.forEach((client) => {
      if (Date.now() - client.lastSeenAt > pingrate * 2) {
        log(`client ${client.id} lost connection`);
        client.socket.terminate();
        return;
      }
      client.socket.ping(noop);
    });
  }, pingrate);

  return server;
}
