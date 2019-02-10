import React from "react";
import ReactDOM from "react-dom";
import Client from "./Client";
import App from "./components/App";

const client = new Client();

// @ts-ignore
global.client = client;

const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);
ReactDOM.render(<App client={client} />, root);
