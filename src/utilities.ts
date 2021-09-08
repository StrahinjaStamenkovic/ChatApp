import { ChatBot } from "./bot";
import { Message } from "./message";
import { User } from "./user";

export let currentlySelectedUser: User = ChatBot.getInstance().botUser;

export function addMessage(message: Message, myMessage: boolean) {
  const flexDirection: string = myMessage ? "flex-row-reverse" : "flex-row";
  let messageOwner: string;

  if (compareObjects(ChatBot.getInstance().botUser, message.from))
    messageOwner = "bot-message";
  else messageOwner = myMessage ? "my-message" : "not-my-message";

  const nameTag: string =
    message.to.id === "everyone" ? message.from.username + ": <br />" : "";
  //console.log(message);

  $(
    `.tab-pane#${
      myMessage || message.to.id === "everyone"
        ? message.to.id
        : message.from.id
    } > .messages`
  ).prepend(
    `
    <div class="d-flex ${flexDirection} mx-2">
      <div class= "
                    message
                    ${messageOwner}
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
  // Scroll to bottom only on my messages
  if (myMessage) $(`.tab-pane#${message.to.id} > .messages`).scrollTop(0);
  else if (message.to.id === "everyone") {
    if (!$(`.nav-tabs a[href="#everyone"]`).hasClass("active"))
      $(`.nav-tabs a[href="#everyone"] > .specific-username`).addClass(
        "font-weight-bold"
      );
  } else if (!$(`.nav-tabs a[href="#${message.from.id}"]`).hasClass("active"))
    $(`.nav-tabs a[href="#${message.from.id}"] > .specific-username`).addClass(
      "font-weight-bold"
    );
}

export function addUser(newUser: User): void {
  const { id, username } = newUser;
  const active: string = newUser.id === "helperBot" ? "active" : "";
  const show: string = newUser.id === "helperBot" ? "show" : "";

  $(".user-tabs").append(
    `
    <li class="nav-item">
      <a class="nav-link ${active}" href="#${id}" data-toggle="tab">
        <div class="specific-username text-break">${username}</div>
      </a>
    </li>
    `
  );

  $(`.nav-tabs a[href="#${id}"]`).on("click", () => {
    currentlySelectedUser = { id, username };
    $(`.nav-tabs a[href="#${id}"] > .specific-username`).removeClass(
      "font-weight-bold"
    );
    $(`tab-pane.active.show`).removeClass("active show");
    $(`tab-pane#${id}`).addClass("active show");
  });

  $(".user-messages-tabs").append(
    `
    <div role="tabpanel" class="tab-pane fade ${active} ${show}" id="${id}"> 
      <h5 class="username mb-0 pl-2 border-bottom d-flex align-items-end text-break">${username}</h5>
      <div class="tab-content d-flex flex-column-reverse messages"></div>
    </div>
    `
  );
}

export function clearUsers(): void {
  $(".user-tabs").empty();
  $(".user-messages-tabs").empty();
}

export function removeUser(id: string): void {
  let tabToRemove: JQuery<HTMLElement> = $(`a[href="#${id}"]`);
  if (tabToRemove) {
    if (tabToRemove.hasClass("active"))
      $(`a[href='#everyone']`).toggleClass("active");
    tabToRemove.parent().remove();
  }
  tabToRemove = $(`#${id}`);
  if (tabToRemove) {
    if (tabToRemove.hasClass("active") && tabToRemove.hasClass("show"))
      $(`#everyone`).addClass("active show");
    tabToRemove.remove();
  }
}

export function compareObjects(firstObject: any, secondObject: any): boolean {
  return JSON.stringify(firstObject) === JSON.stringify(secondObject);
}
