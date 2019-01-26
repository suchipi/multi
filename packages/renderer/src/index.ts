import { State } from "@multi/app-state";

export default class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(targetCanvas) {
    this.canvas = targetCanvas;
    this.ctx = this.canvas.getContext("2d");
  }

  render(state: State) {
    const { ctx, canvas } = this;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    state.entities.forEach((entity) => {
      const { position, color } = entity.components;
      if (position) {
        ctx.beginPath();
        ctx.arc(position.x, position.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = color || "white";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
      }
    });
  }
}
