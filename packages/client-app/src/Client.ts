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
    // @ts-ignore passing LocalAction into remote reducer.
    // Shouldn't be a problem, though, since default case
    // of a reducer returns the current state.
    this.netClient.dispatch(action);
  }

  connect() {
    return this.netClient.connect();
  }

  get selectors() {
    return selectors(this.getState());
  }
}
