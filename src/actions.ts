import { fromEvent } from "rxjs";
import { map, filter, tap, share } from "rxjs/operators";
import { merge, Observable } from "rxjs";
import { addMessage, currentlySelectedUser } from "./utilities";
import { Carousel } from "bootstrap";
import { user } from "./index";
import { Message } from "./message";

// Clicks on 'Send' button
const sendButtonClick$: Observable<Carousel.Event> = fromEvent(
  document.querySelector("#send-message"),
  "click"
);

// Enter key presses in message input field
const enterKeyPress$: Observable<Event> = fromEvent(
  document.querySelector("#message-text-input"),
  "keypress"
).pipe(filter((e: any) => e.keyCode === 13 || e.which === 13));

// Message message send stream
const sendMessage$: Observable<string> = merge(
  sendButtonClick$,
  enterKeyPress$
).pipe(
  map((): string => (<string>$("input#message-text-input").val()).trim()),
  filter((message: string) => !!message),
  tap(() => $("input#message-text-input").val(""))
);

// //Message stream
export const submitAction$: Observable<Message> = sendMessage$.pipe(
  map(
    (payload): Message => ({ from: user, payload, to: currentlySelectedUser })
  ),
  tap((message) => addMessage(message, true)),
  share()
);
