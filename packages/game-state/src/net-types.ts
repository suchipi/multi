import { State, Action } from "./index";

export type ClientActionMessage = {
  type: "action";
  action: Action;
  actionId: number;
};

export type ClientMessage =
  | ClientActionMessage
  | {
      type: "ack";
      snapshotId: number;
    };

export type ServerMessage =
  | {
      type: "snapshot";
      snapshotId: number;
      state: State;
    }
  | {
      type: "ack";
      actionId: number;
    };
