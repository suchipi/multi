import mitt from "mitt";
import debug from "debug";

const log = debug("@multi/client-app/KeyListener");

export default class KeyListener {
  keydown: mitt.Emitter;
  keyup: mitt.Emitter;
  heldKeys: Set<string>;

  constructor() {
    // @ts-ignore
    this.keydown = mitt();
    // @ts-ignore
    this.keyup = mitt();
    this.heldKeys = new Set();
  }

  private _processKeydown = (event: KeyboardEvent) => {
    if (event.repeat) {
      return;
    }
    log(`keydown ${event.key}`);
    this.heldKeys.add(event.key);
    this.keydown.emit(event.key);
  };
  private _processKeyup = (event: KeyboardEvent) => {
    if (event.repeat) {
      return;
    }
    log(`keyup ${event.key}`);
    this.heldKeys.delete(event.key);
    this.keyup.emit(event.key);
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
