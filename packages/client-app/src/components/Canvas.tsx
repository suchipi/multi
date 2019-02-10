import React, { useRef } from "react";
import useFrameCallback from "./useFrameCallback";
import useInitializedRef from "./useInitializedRef";
import Renderer from "../Renderer";
import Updater from "../Updater";
import Client from "../Client";

export default function Canvas({ client }: { client: Client }) {
  const canvasRef = useRef(null);
  const getRenderer = useInitializedRef(() => new Renderer(canvasRef.current));
  const getUpdater = useInitializedRef(() => new Updater());

  useFrameCallback((elapsedTime) => {
    const canvas: HTMLCanvasElement = canvasRef.current;
    if (canvas == null) return;
    const renderer = getRenderer();
    const updater = getUpdater();

    canvas.width = window.innerWidth / 4;
    canvas.height = window.innerHeight / 4;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    updater.update(client, elapsedTime);
    renderer.render(client);
  });

  return (
    <canvas
      ref={canvasRef}
      style={{
        imageRendering: navigator.userAgent.match(/firefox/i)
          ? "-moz-crisp-edges"
          : "pixelated",
      }}
    />
  );
}
