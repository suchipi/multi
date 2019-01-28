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
      try {
        this.socket.send(JSON.stringify(this.messageQueue));
        this.messageQueue = [];
      } catch (err) {
        // Failed to send, either it'll get flushed
        // later or this client will be marked as disconnected
      }
    }
  }

  updateLastSeenAt() {
    this.lastSeenAt = Date.now();
  }
}

export default Client;
