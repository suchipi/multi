import createServer from "little-api/server";
import WebSocket from "ws";
import { State, initialState, reducer } from "@multi/game-state";
import { ClientMessage, ServerMessage } from "@multi/net-protocol";
import RollingQueue from "./RollingQueue";

type Snapshot = {
  snapshotId: number;
  state: State;
};

type Client = {
  id: number;
  socket: WebSocket;
  lastSeenAt: number;
  lastReceivedSnapshot: Snapshot | null;
  messageQueue: Array<ServerMessage>;
};

export default function netServer(log: (message: string) => void) {
  let snapshotId = 0;
  const snapshots: RollingQueue<Snapshot> = new RollingQueue(32);
  snapshots.add({
    snapshotId: snapshotId++,
    state: initialState(),
  });

  const clients: Set<Client> = new Set();
  let clientId = 0;

  const server = createServer({
    socketMethods: {
      connect(socket: WebSocket) {
        const connectionTime = Date.now();

        const client: Client = {
          id: clientId++,
          socket,
          lastSeenAt: connectionTime,
          lastReceivedSnapshot: null,
          messageQueue: [],
        };
        log(`client ${client.id} connected`);

        clients.add(client);

        socket.on("close", () => {
          log(`client ${client.id} disconnected`);
          clients.delete(client);
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
    const messageTime = Date.now();
    client.lastSeenAt = messageTime;

    switch (message.type) {
      case "ack": {
        log(`client ${client.id} acked snapshot ${message.snapshotId}`);
        client.lastReceivedSnapshot = snapshots.find(
          (snapshot) => snapshot.snapshotId === message.snapshotId
        );
        break;
      }
      case "action": {
        const action = message.action;
        log(`client ${client.id} sent action: ${JSON.stringify(action)}`);
        const id = snapshotId++;
        snapshots.add({
          snapshotId: id,
          state: reducer(snapshots.mostRecent().state, action),
        });
        log(`created snapshot ${id}`);
        const ack: ServerMessage = {
          type: "ack",
          actionId: message.actionId,
        };
        client.messageQueue.push(ack);
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
        log(
          `sending snapshot ${mostRecentSnapshot.snapshotId} to client ${
            client.id
          }`
        );
        const message: ServerMessage = {
          type: "snapshot",
          ...mostRecentSnapshot,
        };
        client.messageQueue.push(message);
      }
      if (client.messageQueue.length > 0) {
        client.socket.send(JSON.stringify(client.messageQueue));
      }
      client.messageQueue = [];
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
