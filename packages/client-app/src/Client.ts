import { setEnv } from "@multi/env";
import makeNetClient, { NetClient } from "@multi/net-client";
import setupControls from "./controls";
import KeyListener from "./KeyListener";
import { Action } from "./LocalState/Action";
import { SharedState, selectors } from "./SharedState";
import { LocalState, initialLocalState, localStateReducer } from "./LocalState";

setEnv("client");

export default class Client {
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
    if (!action.type.startsWith("LOCAL")) {
      // @ts-ignore TS doesn't know all local types
      // have to start with LOCAL, so it thinks a
      // local type might make it into here.
      this.netClient.dispatch(action);
    }
  }

  connect() {
    return this.netClient.connect();
  }

  get selectors() {
    return selectors(this.getState());
  }
}
