import { fromEvent, of, Observable } from "rxjs";
import { map, tap, withLatestFrom, filter, switchMap } from "rxjs/operators";
import {
  addMessage,
  addUser,
  clearUsers,
  removeUser,
} from "./utilities";
import { listenOnConnect, emitOnConnect } from "./connection";
import submitAction$ from "./actions";
import { Message } from "./message";

export let myUsername: string;
let username$: Observable<string>;

if (window.localStorage.getItem("username")) {
  username$ = of(window.localStorage.getItem("username"));
} else {
  $("#usernameModal").modal("show");
  username$ = fromEvent($("#usernameSubmitButton"), "click").pipe(
    tap((event: Event) => {
      if ((<string>$("#usernameInput").val()).trim() === "") return;
      myUsername = <string>$("#usernameInput").val();
      window.localStorage.setItem("username", myUsername);
      $(".my-username").html(myUsername);
      $("#usernameModal").modal("hide");
    }),
    switchMap((event: Event) => of(myUsername)),
    filter((username: string) => username !== "")
  );
}

username$.subscribe((username: string) => {
  $(".my-username").html(username);
});

// Add own chat messages to DOM
const submitMessage$: Observable<any> = submitAction$.pipe(
  withLatestFrom(username$),
  tap(([data, username]) => {
    // console.log(data.message);
    // console.log(data.to);
    addMessage(
      new Message({ id: "", username: username }, data.message, data.to),
      true
    );
  }),
  map(([data, username]) => data)
);

// Send username to server
emitOnConnect(username$).subscribe(({ socket, data }) => {
  // console.log(data);
  socket.emit("save username", data);
});

// Send chat messages to server
emitOnConnect(submitMessage$).subscribe(({ socket, data }) => {
  // console.log(socket);
  // console.log(data);
  socket.emit("chat message", data);
});

// Listen for chat messages
listenOnConnect("chat message").subscribe((message: Message) => {
  console.log(message);
  addMessage(message, false);
});

// Listen for list of all connected users
listenOnConnect("all users").subscribe((users: Array<any>) => {
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
  console.log("Removing user with id : " + id);
  removeUser(id);
});

