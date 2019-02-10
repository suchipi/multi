import React, { useState } from "react";
import useFrameCallback from "./useFrameCallback";
import Client from "../Client";

export default function GameState({ client }: { client: Client }) {
  const [gameState, setGameState] = useState("");

  useFrameCallback(() => {
    const clientState = client.getState();
    const clientStateJSON = JSON.stringify(clientState, null, 2);

    if (clientStateJSON !== gameState) {
      setGameState(clientStateJSON);
    }
  });

  return (
    <pre
      style={{
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
      }}
    >
      {gameState}
    </pre>
  );
}
