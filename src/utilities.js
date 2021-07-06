import { fromEvent, Observable, merge, concat } from "rxjs";
import { map, tap, startWith } from "rxjs/operators";

let myUsername;
export let currentlySelectedUser = { id: "everyone", username: "Everyone" };
export function requestUsername() {
  myUsername = prompt("Please enter a username", "");

  // If no username, generate random
  if (!myUsername) {
    const randomNum = Math.floor(Math.random() * 1000);
    myUsername = "user" + randomNum;
    console.log("username input");
  }

  return myUsername;
}

export function addMessage(from, message, to, myMessage) {
  const flexDirection =
    from.username === myUsername ? "flex-row-reverse" : "flex-row";
  const messageOwner =
    from.username === myUsername ? "my-message" : "not-my-message";

  console.log(from);
  console.log(message);
  console.log(to);
  const nameTag = to.id === "everyone" ? from.username + ": <br />" : "";
  //const myMessage = from.username===myUsername;//temporary,remove later
  $(`.tab-pane#${myMessage?to.id:from.id} > .messages`).prepend(
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
                  ${nameTag}${message}
      </div>
      <div class="spacer"></div>
    </div>
    `
  );
  // Scroll to bottom only on my messages
  if (from.username === myUsername)
    $(`.tab-pane#${to.id} > .messages`).scrollTop(0);
}

// Changes to users tabs selection
//export var userSelectChange$ = new Observable().pipe(startWith("everyone"));
//userSelectChange$.subscribe(data => console.log("from observer " + data))

//-----------------------------------------------------------------------------------
export function addUser(id, username) {
  const active = id === "everyone" ? "active" : "";
  const show = id === "everyone" ? "show" : "";
  $(".user-tabs").append(
    `
    <li class="nav-item">
      <a class="nav-link px-1 ${active}" href="#${id}" data-toggle="tab">
        <div class="specific-username">${username}</div>
      </a>
    </li>
    `
  );

  $(`.nav-tabs a[href="#${id}"]`).on("shown.bs.tab", (event) => {
    currentlySelectedUser = { id: id, username: username };
    console.log(currentlySelectedUser);
  });
  /* 
  let newUserSelect$ = fromEvent(
    $(`.nav-tabs a[href="#${id}"]`),
    "shown.bs.tab"
  ).pipe(map((e) => e.target.href.slice(e.target.href.indexOf("#") + 1)));
  userSelectChange$ = merge(userSelectChange$, newUserSelect$);
  */
  $(".user-messages-tabs").append(
    `
    <div role="tabpanel" class="tab-pane fade ${active} ${show}" id="${id}"> 
      <div class="pl-1 username border-bottom username">${username}</div>
      <div class="tab-content d-flex flex-column-reverse messages"></div>
    </div>
    `
  );
}

export const clearUsers = () => {
  $(".user-tabs").empty();
  $(".user-messages-tabs").empty();
};

export const removeUser = (id) => {
  let tabToRemove = $(`a[href="#${id}"]`);
  console.log(tabToRemove);
  if (tabToRemove) {
    console.log(tabToRemove);
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
};
