import { Message } from "./src/message";

class MessageStore {
  saveMessage(message: Message) {}
  findMessagesForUser(userID: string) {}
}

class InMemoryMessageStore extends MessageStore {
  public messages: Array<Message>;
  constructor() {
    super();
    this.messages = [];
  }

  saveMessage(message: Message): void {
    this.messages.push(message);
  }

  findMessagesForUser(userID: string): Message[] {
    return this.messages.filter(
      ({ from, to }) => from.id === userID || to.id === userID
    );
  }
}

module.exports = {
  InMemoryMessageStore,
};
