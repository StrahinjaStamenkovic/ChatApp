import { Socket } from "socket.io";
import {Message} from './message'
export class User {
  public username: string;
  public userID: string;
  public password: string;
  public messages: Array<Message>;
  public socket: Socket;
  constructor(
    username: string,
    userID: string,
    password: string = null,
    messages: Array<Message> = null,
    socket: Socket = null
  ) {
    this.username = username;
    this.userID = userID;
    this.password = password;
    this.messages = [];
  }
}
