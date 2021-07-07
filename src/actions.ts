import { fromEvent } from "rxjs";
import { map, filter, tap, startWith, withLatestFrom } from "rxjs/operators";
import { merge, Observable } from "rxjs";
import { currentlySelectedUser } from "./utilities";
import { Carousel } from "bootstrap";

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
  map((): string => <string>$("input#message-text-input").val()),
  filter((message: string) => message !== ""),
  tap((message: string) => $("input#message-text-input").val(""))
);

// Message stream
const submitAction$: Observable<any> = sendMessage$.pipe(
  //withLatestFrom(userSelectChange$),
  map((message) => ({ message, to: currentlySelectedUser }))
);

export default submitAction$;
