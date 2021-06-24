import { of } from "rxjs";
import { map, tap, withLatestFrom } from "rxjs/operators";
import {
  requestUsername,
  addMessage,
  addUser,
  clearUsers,
  removeUser,
  userSelectChange$,
} from "./utilities";
import { listenOnConnect, emitOnConnect } from "./connection";
import submitAction$ from "./actions";

// Ask user for username
const username$ = of(requestUsername());

username$.subscribe((username) => {
  document.querySelector(".my-username").innerHTML = username;
});
// Add own chat messages to DOM
const submitMessage$ = submitAction$.pipe(
  withLatestFrom(username$),
  tap(([data, username]) => {
    console.log(data.message); //currentlySelectedUser.id?
    addMessage({ id: "", username: username }, data.message, data.to);
  }),
  map(([data]) => data)
);

// Send username to server
emitOnConnect(username$).subscribe(({ socket, data }) => {
  socket.emit("save username", data);
});

// Send chat messages to server
emitOnConnect(submitMessage$).subscribe(({ socket, data }) => {
  console.log(`${socket} , ${data} `);
  socket.emit("chat message", data);
});

// Listen for chat messages
listenOnConnect("chat message").subscribe(({ from, message, to }) => {
  console.log(`${from} , ${message} , ${to}`);
  addMessage(from, message, to);
});

// Listen for list of all connected users
listenOnConnect("all users").subscribe((users) => {
  clearUsers();
  addUser("everyone", "Everyone");
  users.forEach(({ id, username }) => addUser(id, username));
});

// Listen for new users
listenOnConnect("new user").subscribe(({ id, username }) => {
  addUser(id, username);
});

// Listen for user removals
listenOnConnect("remove user").subscribe((id) => {
  removeUser(id);
});

//userSelectChange$.subscribe(data => console.log(data));
