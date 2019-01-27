import { State, Action } from "@multi/game-state";

export type ClientMessage =
  | {
      type: "action";
      action: Action;
    }
  | {
      type: "ack";
      time: number;
    };

export type Snapshot = {
  time: number;
  state: State;
};

export type ServerMessage = Snapshot;
