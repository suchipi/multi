import { ClientID } from "./ClientID";
import { Vector } from "./models";

export type Action =
  | {
      type: "PLAYER_JOIN";
      clientId: ClientID;
    }
  | {
      type: "PLAYER_LEAVE";
      clientId: ClientID;
    }
  | {
      type: "PLAYER_MOVE";
      clientId: ClientID;
      movement: Vector;
    };
