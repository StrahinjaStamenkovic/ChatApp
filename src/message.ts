import { User } from "./user";

export interface Message {
  to: User;
  from?: User;
  payload: string;
}
