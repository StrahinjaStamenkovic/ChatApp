import { Observable } from "rxjs";
import { delay, filter, map, switchMap, tap } from "rxjs/operators";
import { partitionedMessage$, user } from ".";
import { Message } from "./message";
import { User } from "./user";
import {
  addMessage,
  addUser,
  compareObjects,
  currentlySelectedUser,
} from "./utilities";

export class ChatBot {
  private static instance: ChatBot;
  public botUser: User;

  submitBotMessage$: Observable<Message>;
  botCommand$: Observable<Message>;
  botResponse$: Observable<Message>;
  public static getInstance(): ChatBot {
    if (!ChatBot.instance) {
      ChatBot.instance = new ChatBot();
    }

    return ChatBot.instance;
  }
  private constructor() {
    this.botUser = { id: "helperBot", username: "HelperBot" };

    setTimeout(() => {
      this.submitBotMessage$ = partitionedMessage$[0].pipe(
        tap((message) => console.log("success from submit", message))
      );

      this.botCommand$ = this.submitBotMessage$.pipe(
        filter((message: Message) => message.payload.startsWith("!"))
      );

      this.botResponse$ = this.botCommand$.pipe(
        delay(500),
        map(
          (message: Message): Message =>
            this.getResponse(...message.payload.split(" "))
        )
      );

      this.botResponse$.subscribe((botResponse) => {
        console.log(botResponse);
        this.addBotMessage(botResponse);
      });
    }, 100);
  }

  createBotTab() {
    addUser(this.botUser);
    this.welcomeMessage();
  }

  welcomeMessage() {
    console.log(user);
    let welcomeMessage: Message = {
      to: user,
      from: this.botUser,
      payload: botMessages.welcome,
    };
    this.addBotMessage(welcomeMessage);
  }

  getResponse(...parameters: string[]): Message {
    const command = parameters[0].replace("!", "");
    let response = {
      to: currentlySelectedUser,
      from: this.botUser,
      payload: "",
    };
    if (!botMessages[command]) response.payload = botMessages["default"]();
    else response.payload = botMessages[command]();

    return response;
  }

  addBotMessage(message: Message) {
    const nameTag: string =
      message.to.id === "everyone" ? message.from.username + ": <br />" : "";

    $(`.tab-pane#${message.to.id} > .messages`).prepend(
      `
    <div class="d-flex flex-row mx-2">
      <div class= "
                    message
                    bot-message
                    text-break
                    px-3
                    py-2
                    my-1
                    mx-2
                    text-left
                  "
                >
                  ${nameTag}${message.payload}
      </div>
      <div class="spacer"></div>
    </div>
    `
    );
  }
}

let botMessages: { [key: string]: string | any } = {
  help: () => `Here is a list of commands you can use: <br />

   &emsp; !welcome &ensp; -Displays the welcome message. <br />
   &emsp; !help &ensp; -Lists all available commands with a short explanation for each one. <br />
   &emsp; !liveUsers &ensp; -Shows the current number of online users. <br />
   &emsp; !time &ensp; -Displays the current time. <br />
   &emsp; !messages &ensp; -Displays statistics on exchanged messages with the currently selected user. <br />
   &emsp; !blocked &ensp; -Displays all blocked users. <br />
   &emsp; !block &lt;username&gt; &ensp; -Block the user with the specified username.`,
  get welcome() {
    return `Welcome to a chatting site, I'm a bot designed to help get to know you with the functionalities of the site. <br /><br />
  There are a few commands that help achieve this. All of the commands start with an exclamation point (!). <br /><br />
      ${this.help()}
      <br />
  You can use these commands while chatting to anyone, not just me, and the user wont see these messages.`;
  },

  liveUsers: () =>
    `There are currently ${
      $(".specific-username").length - 1
    } connected users including you.`,

  time: () => `The current time is: ${Date.now()}.`,

  messages: (): string => {
    const total: number = $(
      `#${currentlySelectedUser.id} > .messages .message`
    ).length;
    const yours: number = $(
      `#${currentlySelectedUser.id} > .messages .my-message`
    ).length;
    const theirs: number = total - yours;

    return `You have exchanged a total of ${total} messages with the user ${currentlySelectedUser.username},
   out of which ${yours} were sent by you and ${theirs} by ${currentlySelectedUser.username}.`;
  },
  blocked: () => ``,
  block: () => ``,
  default: () => `Invalid command. <br />
  Type !help for a list of available commands.`,
};
