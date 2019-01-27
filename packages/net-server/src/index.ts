import createServer from "little-api/server";
import WebSocket from "ws";
import { initialState, reducer } from "@multi/game-state";
import { Snapshot, ClientMessage, ServerMessage } from "@multi/net-protocol";

type Client = {
  id: number;
  socket: WebSocket;
  lastSeenAt: number;
  lastSnapshotAcked: number;
};

export default function netServer(log: (message: string) => void) {
  let currentSnapshot: Snapshot = {
    time: Date.now(),
    state: initialState(),
  };

  const clients: Set<Client> = new Set();
  let id = 0;

  const server = createServer({
    socketMethods: {
      connect(socket: WebSocket) {
        const connectionTime = Date.now();

        const client: Client = {
          id: id++,
          socket,
          lastSeenAt: connectionTime,
          lastSnapshotAcked: 0,
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
        client.lastSnapshotAcked = message.time;
        log(`client ${client.id} acked snapshot ${message.time}`);
        break;
      }
      case "action": {
        const action = message.action;
        log(`client ${client.id} sent action: ${JSON.stringify(action)}`);
        currentSnapshot = {
          time: messageTime,
          state: reducer(currentSnapshot.state, action),
        };
        log(`created snapshot ${messageTime}`);
        break;
      }
    }
  }

  // Every 33ms, check for clients that haven't
  // acked the latest snapshot and send it to them
  const tickrate = 33;
  setInterval(() => {
    clients.forEach((client) => {
      if (client.lastSnapshotAcked < currentSnapshot.time) {
        log(`sending snapshot ${currentSnapshot.time} to client ${client.id}`);
        const message: ServerMessage = currentSnapshot;
        client.socket.send(JSON.stringify(message));
      }
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
