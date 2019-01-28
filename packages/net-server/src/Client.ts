import WebSocket from "ws";
import { ServerMessage, ClientID } from "@multi/game-state";
import Snapshot from "./Snapshot";

class Client {
  id: ClientID;
  socket: WebSocket;
  lastSeenAt: number;
  lastReceivedSnapshot: Snapshot | null;
  messageQueue: Array<ServerMessage>;
  leaveTimeout: NodeJS.Timeout;

  constructor(id: ClientID, socket: WebSocket) {
    this.id = id;
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
