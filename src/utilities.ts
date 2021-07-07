import { fromEvent, Observable, merge, concat } from "rxjs";
import { map, tap, startWith } from "rxjs/operators";
import { myUsername } from "./index";
import { Message } from "./message";

export let currentlySelectedUser = { id: "everyone", username: "Everyone" };

export function addMessage(message: Message, myMessage: boolean) {
  const flexDirection: string = myMessage ? "flex-row-reverse" : "flex-row";
  const messageOwner: string = myMessage ? "my-message" : "not-my-message";
  const nameTag: string =
    message.to.id === "everyone" ? message.from.username + ": <br />" : "";

  console.log(message);
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
  if (message.from.username === myUsername)
    $(`.tab-pane#${message.to.id} > .messages`).scrollTop(0);
}

export function addUser(id: string, username: string): void {
  const active: string = id === "everyone" ? "active" : "";
  const show: string = id === "everyone" ? "show" : "";
  $(".user-tabs").append(
    `
    <li class="nav-item">
      <a class="nav-link px-1 ${active}" href="#${id}" data-toggle="tab">
        <div class="specific-username text-break">${username}</div>
      </a>
    </li>
    `
  );

  $(`.nav-tabs a[href="#${id}"]`).on("click", () => {
    currentlySelectedUser = { id: id, username: username };
    $(`tab-pane.active.show`).removeClass("active show");
    $(`tab-pane#${id}`).addClass("active show");
  });

  $(".user-messages-tabs").append(
    `
    <div role="tabpanel" class="tab-pane fade ${active} ${show}" id="${id}"> 
      <h5 class="pl-1 my-0 username border-bottom d-flex align-items-end text-break">${username}</h5>
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
      $(`a[href='#everyone']`).addClass("active");
    tabToRemove.parent().remove();
  }
  tabToRemove = $(`#${id}`);
  if (tabToRemove) {
    if (tabToRemove.hasClass("active") && tabToRemove.hasClass("show"))
      $(`#everyone`).addClass("active show");
    tabToRemove.remove();
  }
}
