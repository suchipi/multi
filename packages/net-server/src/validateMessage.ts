import { ClientMessage } from "@multi/game-state";
import Client from "./Client";

export default function validateMessage(
  client: Client,
  message: ClientMessage
): boolean {
  switch (message.type) {
    case "ack": {
      return true;
    }
    case "action": {
      switch (message.action.type) {
        case "PLAYER_JOIN":
        case "PLAYER_LEAVE":
        case "PLAYER_MOVE": {
          return message.action.clientId === client.id;
        }
      }
    }
  }
}
