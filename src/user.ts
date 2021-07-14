import { Socket } from "socket.io";
import { Message } from "./message";
export interface User {
  // username: string;
  // userID: string;
  // password: string;
  // messages: Array<Message>;
  // socket: Socket;
  id: string;
  username: string;
}
