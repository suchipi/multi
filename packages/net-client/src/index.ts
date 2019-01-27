import createClient from "little-api/client";
import { reducer, initialState, State, Action } from "@multi/game-state";
import {
  ServerMessage,
  ClientMessage,
  ClientActionMessage,
} from "@multi/net-protocol";

export type NetClient = {
  connect(): Promise<void>;
  dispatch(action: Action): void;
  getState(): State;
};

const netClient = (
  url: string,
  log: (...message: Array<any>) => void
): NetClient => {
  const api: any = createClient({
    url,
    socketMethods: ["connect"],
  });

  let socket: WebSocket;
  let knownState: State = initialState();
  let optimisticState: State = knownState;
  let optimisticMessageQueue: Array<ClientActionMessage> = [];
  let actionId: number = 0;

  const send = (message: ClientMessage) => {
    socket.send(JSON.stringify(message));
  };

  const recalculateOptimisticState = () => {
    optimisticState = optimisticMessageQueue.reduce(
      (lastState, clientMessage) => {
        return reducer(lastState, clientMessage.action);
      },
      knownState
    );
    log("Recalculated optimistic state", optimisticState);
  };

  return {
    connect: () => {
      return new Promise((resolve, reject) => {
        socket = api.connect();
        socket.onmessage = (event) => {
          const serverMessages: Array<ServerMessage> = JSON.parse(event.data);
          log("Received messages from server:", serverMessages);

          serverMessages.forEach((serverMessage) => {
            switch (serverMessage.type) {
              case "snapshot": {
                log(`Acking snapshot ${serverMessage.snapshotId}`);
                send({
                  type: "ack",
                  snapshotId: serverMessage.snapshotId,
                });
                knownState = serverMessage.state;
              }
              case "ack": {
                // @ts-ignore failure to refine type
                const { actionId } = serverMessage;
                const indexOfMessage = optimisticMessageQueue.findIndex(
                  (clientMessage) => clientMessage.actionId === actionId
                );
                if (indexOfMessage !== -1) {
                  log(
                    `Server acked ${actionId}; removing from optimistic message queue`
                  );
                  optimisticMessageQueue.splice(indexOfMessage, 1);
                  log("Optimistic message queue: ", [
                    ...optimisticMessageQueue,
                  ]);
                }
              }
            }
          });

          recalculateOptimisticState();
        };
        socket.onopen = () => resolve();
        socket.onerror = () => reject(new Error("Websocket failed to open"));
      });
    },
    dispatch: (action: Action) => {
      // clientside prediction
      const message: ClientMessage = {
        type: "action",
        action,
        actionId: actionId++,
      };
      log(`Outbound message ${message.actionId}:`, message);
      optimisticMessageQueue.push(message);
      log(`Added message ${message.actionId} to optimistic message queue:`, [
        ...optimisticMessageQueue,
      ]);
      recalculateOptimisticState();

      // send to server
      log(`Sending message ${message.actionId} to server`);
      send(message);
    },
    getState: () => {
      return optimisticState;
    },
  };
};

export default netClient;
