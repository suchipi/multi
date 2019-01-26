import { setEnv } from "@multi/env";
import netClient from "@multi/net-client";
import Renderer from "@multi/renderer";

setEnv("client");
const client = netClient("http://localhost:6789");

// @ts-ignore
global.client = client;

const canvas = document.createElement("canvas");
// @ts-ignore
canvas.style.imageRendering = "pixelated";

const pre = document.createElement("pre");
Object.assign(pre.style, {
  backgroundColor: "white",
  color: "black",
  position: "fixed",
  bottom: "0",
  right: "0",
  margin: "0",
  padding: "5px",
  maxHeight: "100vh",
  maxWidth: "33vw",
  overflow: "auto",
});

document.body.appendChild(canvas);
document.body.appendChild(pre);

const renderer = new Renderer(canvas);

function onFrame() {
  canvas.width = window.innerWidth / 4;
  canvas.height = window.innerHeight / 4;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  const state = client.getState();
  renderer.render(state);
  pre.textContent = JSON.stringify(state, null, 2);

  requestAnimationFrame(onFrame);
}

client.connect().then(
  () => {
    requestAnimationFrame(onFrame);
  },
  (err) => {
    document.body.innerText = "Connection error";
    console.error(err);
  }
);
