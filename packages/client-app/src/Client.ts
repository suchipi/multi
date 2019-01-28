import makeNetClient, { NetClient } from "@multi/net-client";
import { ClientID } from "@multi/game-state";
import setupControls from "./controls";
import KeyListener from "./KeyListener";
import { Action } from "./LocalState/Action";
import { SharedState, selectors } from "./SharedState";
import { LocalState, initialLocalState, localStateReducer } from "./LocalState";

export default class Client {
  id: ClientID;
  netClient: NetClient;
  localState: LocalState;
  controls: KeyListener;

  constructor() {
    this.netClient = makeNetClient("http://localhost:6789");
    this.localState = initialLocalState();
    this.controls = setupControls(this);
    this.controls.bindListeners();
  }

  getState(): SharedState {
    return {
      local: this.localState,
      game: this.netClient.getState(),
    };
  }

  dispatch(action: Action) {
    this.localState = localStateReducer(this.localState, action);
    // Don't dispatch local actions (which only affect local state, not game state)
    if (!action.type.startsWith("LOCAL")) {
      // @ts-ignore TS doesn't know all local types
      // have to start with LOCAL, so it thinks a
      // local type might make it into here.
      this.netClient.dispatch(action);
    }
  }

  connect() {
    return this.netClient.connect().then((id) => {
      this.id = id;
    });
  }

  get selectors() {
    return selectors(this.getState());
  }
}
