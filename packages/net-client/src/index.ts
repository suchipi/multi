import createClient from "little-api/client";
import {
  setEnv,
  reducer,
  initialState,
  State,
  Action,
  ServerMessage,
  ClientMessage,
  ClientActionMessage,
  ClientID,
} from "@multi/game-state";
import debug from "debug";

const log = debug("@multi/net-client");

export type NetClient = {
  connect(): Promise<ClientID>;
  dispatch(action: Action): void;
  getState(): State;
};

const optimismTimeout = 2000; // ms

const netClient = (url: string): NetClient => {
  setEnv("client");

  const api: any = createClient({
    url,
    methods: ["createId"],
    socketMethods: ["connect"],
  });

  let socket: WebSocket;
  let knownState: State = initialState();
  let optimisticState: State = knownState;
  let optimisticMessageQueue: Array<ClientActionMessage> = [];
  let actionId: number = 0;

  const send = (message: ClientMessage) => {
    try {
      socket.send(JSON.stringify(message));
    } catch (err) {
      // ignored
    }
  };

  const recalculateOptimisticState = () => {
    optimisticState = optimisticMessageQueue.reduce(
      (lastState, clientMessage) => {
        return reducer(lastState, clientMessage.action);
      },
      knownState
    );
  };

  function receiveAck(actionId) {
    const indexOfMessage = optimisticMessageQueue.findIndex(
      (clientMessage) => clientMessage.actionId === actionId
    );
    if (indexOfMessage !== -1) {
      const message = optimisticMessageQueue[indexOfMessage];
      log(`Server acked ${actionId}; removing from optimistic message queue`);
      optimisticMessageQueue.splice(indexOfMessage, 1);
      log("Optimistic message queue: ", [...optimisticMessageQueue]);
    }
  }

  function receiveMessages(serverMessages: Array<ServerMessage>) {
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
          receiveAck(actionId);
        }
      }
    });

    recalculateOptimisticState();
  }

  var client = {
    connect: () => {
      function connectToSocket(clientId: ClientID) {
        return new Promise((resolve) => {
          socket = api.connect(clientId);
          socket.onmessage = (event) => {
            const serverMessages: Array<ServerMessage> = JSON.parse(event.data);
            receiveMessages(serverMessages);
          };
          socket.onopen = () => {
            log("Connected to server");
            resolve(clientId);
          };
          socket.onclose = () => {
            log("Socket closed; reconnecting in 1 second");
            setTimeout(() => {
              resolve(client.connect());
            }, 1000);
          };
        });
      }

      if (localStorage.clientId) {
        return connectToSocket(localStorage.clientId);
      } else {
        return api.createId().then((clientId) => {
          localStorage.clientId = clientId;
          return connectToSocket(clientId);
        });
      }
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

      log(`Sending message ${message.actionId} to server`);
      send(message);

      setTimeout(() => {
        if (optimisticMessageQueue.includes(message)) {
          // The message still hasn't been confirmed by the server.
          // Let's give up on it.
          log(
            `Server hasn't confirmed ${
              message.actionId
            } within ${optimismTimeout}ms. Removing from optimistic message queue.`
          );
          optimisticMessageQueue = optimisticMessageQueue.filter(
            (otherMessage) => otherMessage !== message
          );
          log(`Optimistic message queue:`, [...optimisticMessageQueue]);
          recalculateOptimisticState();
        }
      }, optimismTimeout);
    },
    getState: () => {
      return optimisticState;
    },
  };

  return client;
};

export default netClient;
