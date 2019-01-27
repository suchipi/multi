import { State } from "@multi/game-state";

let snapshotId = 0;
export default class Snapshot {
  id: number;
  state: State;

  constructor(state: State) {
    this.id = snapshotId++;
    this.state = state;
  }
}
