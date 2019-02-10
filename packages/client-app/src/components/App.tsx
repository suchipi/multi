import React, { useEffect, useState } from "react";
import { FrameProvider } from "./useFrameCallback";
import Canvas from "./Canvas";
import GameState from "./GameState";
import Client from "../Client";

export default function App({ client }: { client: Client }) {
  const [loadingState, setLoadingState] = useState<
    "connecting" | "connected" | "error"
  >("connecting");

  useEffect(() => {
    client.connect().then(
      () => {
        setLoadingState("connected");
      },
      (err) => {
        setLoadingState("error");
        console.error(err);
      }
    );
  }, []);

  return (
    {
      connecting: <span>Connecting...</span>,
      error: <>Connection error, please refresh</>,
      connected: (
        <FrameProvider>
          <Canvas client={client} />
          <GameState client={client} />
        </FrameProvider>
      ),
    }[loadingState] || null
  );
}
