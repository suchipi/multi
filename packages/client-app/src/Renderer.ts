import Client from "./Client";
import { subtractVec2 } from "@multi/models";

export default class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(targetCanvas) {
    this.canvas = targetCanvas;
    this.ctx = this.canvas.getContext("2d");
  }

  render(client: Client) {
    const { ctx, canvas } = this;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const entities = client.selectors.game.getEntities();
    const cameraPosition = client.selectors.client.getCameraPosition();
    entities.forEach((entity) => {
      const { position, color } = entity.components;
      if (position) {
        const offsetPosition = subtractVec2(position, cameraPosition);

        ctx.beginPath();
        ctx.arc(offsetPosition.x, offsetPosition.y, 20, 0, 2 * Math.PI);
        ctx.fillStyle = color || "white";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();
      }
    });
  }
}
