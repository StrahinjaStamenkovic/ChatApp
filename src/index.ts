import { fromEvent, of, Observable, combineLatest, partition } from "rxjs";
import { map, tap, filter, switchMap, startWith } from "rxjs/operators";
import {
  addMessage,
  addUser,
  compareObjects,
  currentlySelectedUser,
  removeUser,
} from "./utilities";
import { listenOnConnect, emitOnConnect, connect$ } from "./connection";
import { submitAction$ } from "./actions";
import { Message } from "./message";
import { User } from "./user";
import { ChatBot } from "./bot";

export let user: User;
let username$: Observable<string> = of("");
const helperBot = ChatBot.getInstance();

if (localStorage.getItem("username")) {
  username$ = of(window.localStorage.getItem("username"));
} else {
  $("#usernameModal").modal("show");
  username$ = fromEvent($("#usernameSubmitButton"), "click").pipe(
    tap(() => $("#usernameModal").modal("hide")),
    switchMap(() => of($("#usernameInput").val().toString().trim())),
    filter((username: string) => !!username)
  );
}

username$.subscribe((username: string) => {
  $(".my-username").html(username);
  localStorage.setItem("username", username);
});

//Stream of user data
export const user$: Observable<User> = combineLatest([
  connect$,
  username$,
]).pipe(map(([socket, username]) => ({ id: socket?.id, username })));

user$.subscribe((emitedUser) => {
  user = emitedUser;
  helperBot.createBotTab();
});

export const partitionedMessage$: Observable<Message>[] = partition(
  submitAction$,
  (message) =>
    compareObjects(currentlySelectedUser, helperBot.botUser) ||
    message.payload.startsWith("!")
);

const submitMessage$: Observable<Message> = partitionedMessage$[1].pipe(
  tap((message) => console.log(message))
);

// Send username to server
emitOnConnect(username$).subscribe(({ socket, data }) => {
  socket.emit("save username", data);
});

// Send chat messages to server
emitOnConnect(submitMessage$).subscribe(({ socket, data }) => {
  console.log(data);
  socket.emit("chat message", data);
});

// Listen for chat messages
listenOnConnect("chat message").subscribe((message: Message) => {
  console.log(message);
  addMessage(message, false);
});

// Listen for list of all connected users
listenOnConnect("all users").subscribe((users: Array<User>) => {
  addUser({ id: "everyone", username: "Everyone" });
  users.forEach((userElement) => addUser(userElement));
});

// Listen for new users
listenOnConnect("new user").subscribe((newUser) => {
  addUser(newUser);
});

// Listen for user removals
listenOnConnect("remove user").subscribe(({ id, username }) => {
  removeUser(id);
});
