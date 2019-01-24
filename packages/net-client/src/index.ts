import createClient from "little-api/client";
import reducer, { initialState, State, Action } from "@multi/app-state";
import { ServerMessage, ClientMessage } from "@multi/net-protocol";

type NetClient = {
  connect(): Promise<void>;
  dispatch(action: Action): void;
  getState(): State;
};

const netClient = (url: string): NetClient => {
  const api: any = createClient({
    url,
    socketMethods: ["connect"],
  });

  let socket: WebSocket;
  let state: State = initialState();

  const send = (message: ClientMessage) => {
    socket.send(JSON.stringify(message));
  };

  return {
    connect: () => {
      return new Promise((resolve, reject) => {
        socket = api.connect();
        socket.onmessage = (event) => {
          const snapshot: ServerMessage = JSON.parse(event.data);
          console.log("Received snapshot: ", snapshot);
          send({ type: "ack", time: snapshot.time });
          state = snapshot.state;
        };
        socket.onopen = () => resolve();
        socket.onerror = () => reject(new Error("Websocket failed to open"));
      });
    },
    dispatch: (action: Action) => {
      // clientside prediction
      state = reducer(state, action);
      // send to server
      send({ type: "action", action });
    },
    getState: () => {
      return state;
    },
  };
};

export default netClient;
