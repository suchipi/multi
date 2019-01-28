import Renderer from "./Renderer";
import Updater from "./Updater";
import Client from "./Client";

const client = new Client();

// @ts-ignore
global.client = client;

const canvas = document.createElement("canvas");
Object.assign(canvas.style, {
  imageRendering: "pixelated",
});

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
pre.textContent = "Connecting...";

document.body.appendChild(canvas);
document.body.appendChild(pre);

const renderer = new Renderer(canvas);
const updater = new Updater();

let lastTime = null;
function onFrame(currentTime) {
  canvas.width = window.innerWidth / 4;
  canvas.height = window.innerHeight / 4;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  if (lastTime == null) {
    lastTime = currentTime;
    requestAnimationFrame(onFrame);
    return;
  }
  const elapsedTime = currentTime - lastTime;
  lastTime = currentTime;

  updater.update(client, elapsedTime);
  renderer.render(client);

  const gameState = client.getState();
  pre.textContent = JSON.stringify(gameState, null, 2);

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
