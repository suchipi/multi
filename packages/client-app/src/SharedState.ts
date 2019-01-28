import {
  State as GameState,
  selectors as gameSelectors,
} from "@multi/game-state";
import { LocalState, localSelectors } from "./LocalState";

export type SharedState = {
  local: LocalState;
  game: GameState;
};

export const selectors = (state: SharedState) => ({
  local: localSelectors(state.local),
  game: gameSelectors(state.game),
});
