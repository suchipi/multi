import Client from "./Client";
import {
  subtractPoint,
  vectorToPoint,
  addPoint,
  makePoint,
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
    const cameraPoint = client.selectors.local.getCameraPosition();
    entities.forEach((entity) => {
      const { position, color, direction } = entity;
      if (position) {
        const offsetPoint = subtractPoint(position, cameraPoint);
        const canvasPoint = addPoint(
          offsetPoint,
          makePoint(canvas.width / 2, canvas.height / 2)
        );

        ctx.beginPath();
        ctx.arc(canvasPoint.x, canvasPoint.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = color || "white";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.stroke();

        if (direction) {
          ctx.strokeStyle = color || "white";
          ctx.beginPath();
          ctx.moveTo(canvasPoint.x, canvasPoint.y);
          const arrowEndPoint = addPoint(
            canvasPoint,
            vectorToPoint(makeVector(direction, 11))
          );
          ctx.lineTo(arrowEndPoint.x, arrowEndPoint.y);
          ctx.stroke();
        }
      }
    });
  }
}
