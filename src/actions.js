import { fromEvent } from "rxjs";
import {
  map,
  filter,
  tap,
  startWith,
  withLatestFrom,
  pipe,
} from "rxjs/operators";
import { merge } from "rxjs";
import { currentlySelectedUser } from "./utilities";
// Clicks on 'Send' button
const sendButtonClick$ = fromEvent(
  document.querySelector("#send-message"),
  "click"
);

// Enter key presses in message input field
const enterKeyPress$ = fromEvent(
  document.querySelector("#message-text-input"),
  "keypress"
).pipe(filter((e) => e.keyCode === 13 || e.which === 13));

// Message message send stream
const sendMessage$ = merge(sendButtonClick$, enterKeyPress$).pipe(
  map(() => document.querySelector("input#message-text-input").value),
  filter((message) => message),
  tap(
    (message) => (document.querySelector("input#message-text-input").value = "")
  )
);

// Message stream
const submitAction$ = sendMessage$.pipe(
  //withLatestFrom(userSelectChange$),
  map((message) => ({ message, to: currentlySelectedUser}))
);

export default submitAction$;
