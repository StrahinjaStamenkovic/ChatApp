import { of, fromEvent, Observable } from "rxjs";
import { map, mapTo, switchMap } from "rxjs/operators";
import { Socket } from "socket.io";
import io from "socket.io-client";

const URL = "http://localhost:3000";
// Initialise Socket.IO and wrap in observable
export const socket$: Observable<any> = of(io());

// Stream of connections
export const connect$: Observable<Socket> = socket$.pipe(
  switchMap((socket) => fromEvent(socket, "connect").pipe(mapTo(socket)))
);

// On connection, listen for event
export function listenOnConnect(event: string): Observable<any> {
  return connect$.pipe(switchMap((socket) => fromEvent(socket, event)));
}
// On connection, emit data from observable
export function emitOnConnect(observable: Observable<any>): Observable<any> {
  return connect$.pipe(
    switchMap((socket) => observable.pipe(map((data) => ({ socket, data }))))
  );
}
