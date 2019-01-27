import WebSocket from "ws";
import { ServerMessage } from "@multi/net-protocol";
import Snapshot from "./Snapshot";

let clientId = 0;
class Client {
  id: number;
  socket: WebSocket;
  lastSeenAt: number;
  lastReceivedSnapshot: Snapshot | null;
  messageQueue: Array<ServerMessage>;

  constructor(socket: WebSocket) {
    this.id = clientId++;
    this.socket = socket;
    this.lastSeenAt = Date.now();
    this.lastReceivedSnapshot = null;
    this.messageQueue = [];
  }

  addMessageToQueue(message: ServerMessage) {
    this.messageQueue.push(message);
  }

  flushQueue() {
    if (this.messageQueue.length > 0) {
      this.socket.send(JSON.stringify(this.messageQueue));
    }
    this.messageQueue = [];
  }

  updateLastSeenAt() {
    this.lastSeenAt = Date.now();
  }
}

export default Client;
