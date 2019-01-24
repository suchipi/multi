import netClient from "@multi/net-client";

const client = netClient("http://localhost:6789");

client.connect().then(
  () => {
    const div = document.createElement("div");
    const button = document.createElement("button");
    button.textContent = "Increase";
    button.onclick = () => {
      client.dispatch({ type: "INCREASE" });
    };
    document.body.appendChild(div);
    document.body.appendChild(button);

    setInterval(() => {
      div.textContent = `Count: ${client.getState().count}`;
    }, 33);
  },
  (err) => {
    document.body.innerText = "Connection error";
    console.error(err);
  }
);
