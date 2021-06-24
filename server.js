const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io");
const PORT = process.env.PORT || 3000;

let users = [];

const { of, fromEvent } = require("rxjs");
const {
  map,
  mapTo,
  switchMap,
  mergeMap,
  takeUntil,
} = require("rxjs/operators");

// Serve static files
app.use(express.static("client"));
app.use("/static", express.static("./static"));

// Start app listening
http.listen(PORT, () => console.log("listening on port: " + PORT));

// Initialise Socket.IO and wrap in observable
const io$ = of(io(http));

// Stream of connections
const connection$ = io$.pipe(
  switchMap((io) =>
    fromEvent(io, "connection").pipe(map((client) => ({ io, client })))
  )
);

// Stream of disconnections
const disconnect$ = connection$.pipe(
  mergeMap(({ client }) => fromEvent(client, "disconnect").pipe(mapTo(client)))
);

// On connection, listen for event
const listenOnConnect = (event) =>
  connection$.pipe(
    mergeMap(({ io, client }) =>
      fromEvent(client, event).pipe(
        takeUntil(fromEvent(client, "disconnect")),
        map((data) => ({ io, client, data }))
      )
    )
  );

// On connection, send array of all users
connection$.subscribe(async ({ io, client }) => {
  console.log("Sending a list of all connected users");
  //console.log(client.id);
  console.log(users);
  client.emit("all users", users);
});

// On disconnect, tell other users, also remove the entry from users set
disconnect$.subscribe((client) => {
  client.broadcast.emit("remove user", client.id);
  users = users.filter((user, index) => user.id !== client.id);
});

// Listen for message events and send to relevant users
listenOnConnect("chat message").subscribe(({ client, data }) => {
  const from = users.find((user) => user.id === client.id); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const { id, message } = data;
  const to = users.find((user) => user.id === data.id);
  console.log(`${id}`);
  console.log(`${from.id}  ${from.username}, ${message} , ${to}`);
  if (!id) return;

  console.log(`${from} , ${message} , ${to}`);
  id === "everyone"
    ? client.broadcast.emit("chat message", {
        from,
        message,
        to: { id: "everyone", username: "Everyone" },
      }) // Send to everyone
    : client.broadcast.to(id).emit("chat message", { from, message, to }); // Send only to socket
});

// Listen for new usernames and store in corresponding socket object
listenOnConnect("save username").subscribe(
  async ({ io, client, data: username }) => {
    const allSockets = await io.sockets.allSockets();
    const id = client.id;

    users.push({ id: id, username: username });
    console.log("User connected");
    console.log(users);
    client.broadcast.emit("new user", { id, username });
  }
);
