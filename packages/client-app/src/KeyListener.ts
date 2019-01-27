import mitt from "mitt";

export default class KeyListener {
  keydown: mitt.Emitter;
  keyup: mitt.Emitter;

  constructor() {
    // @ts-ignore
    this.keydown = mitt();
    // @ts-ignore
    this.keyup = mitt();
  }

  private _processKeydown = (event: KeyboardEvent) => {
    this.keydown.emit(event.key);
  };
  private _processKeyup = (event: KeyboardEvent) => {
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
