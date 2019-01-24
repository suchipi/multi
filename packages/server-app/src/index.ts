import netServer from "@multi/net-server";

const server = netServer(console.log);

server.listen(6789, () => {
  console.log("Server is listening on port 6789");
});
