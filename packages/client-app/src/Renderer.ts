import Client from "./Client";
import {
  subtractPosition,
  vectorToPosition,
  addPosition,
  makePosition,
  makeVector,
} from "@multi/game-state";

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
    const cameraPosition = client.selectors.local.getCameraPosition();
    entities.forEach((entity) => {
      const { position, color, direction } = entity.components;
      if (position) {
        const offsetPosition = subtractPosition(position, cameraPosition);
        const canvasPosition = addPosition(
          offsetPosition,
          makePosition(canvas.width / 2, canvas.height / 2)
        );

        ctx.beginPath();
        ctx.arc(canvasPosition.x, canvasPosition.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = color || "white";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();

        if (direction) {
          ctx.strokeStyle = color || "white";
          ctx.beginPath();
          ctx.moveTo(canvasPosition.x, canvasPosition.y);
          const arrowEndPosition = addPosition(
            canvasPosition,
            vectorToPosition(makeVector(direction, 11))
          );
          ctx.lineTo(arrowEndPosition.x, arrowEndPosition.y);
          ctx.stroke();
        }
      }
    });
  }
}
