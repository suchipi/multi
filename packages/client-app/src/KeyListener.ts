import debug from "debug";

const log = debug("@multi/client-app/KeyListener");

export default class KeyListener {
  pressed: Set<string> = new Set();

  private _processKeydown = (event: KeyboardEvent) => {
    if (event.repeat) {
      return;
    }
    log(`keydown ${event.key}`);
    this.pressed.add(event.key);
  };
  private _processKeyup = (event: KeyboardEvent) => {
    if (event.repeat) {
      return;
    }
    log(`keyup ${event.key}`);
    this.pressed.delete(event.key);
  };

  bindListeners() {
    document.addEventListener("keydown", this._processKeydown);
    document.addEventListener("keyup", this._processKeyup);
  }

  unbindListeners() {
    document.removeEventListener("keydown", this._processKeydown);
    document.removeEventListener("keyup", this._processKeyup);
  }
}
