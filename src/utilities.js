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

export function addMessage(from, message, to) {
  const flexDirection =
    from.username === myUsername ? "flex-row-reverse" : "flex-row";
  const messageOwner =
    from.username === myUsername ? "my-message" : "not-my-message";

  console.log(from);
  console.log(message);
  console.log(to);
  const nameTag = to.id === "everyone" ? from.username + ": <br />" : "";
 
  let tab = document.querySelector(
    `.tab-pane#${to.id} > .tab-content#messages`
  );
  tab.insertAdjacentHTML(
    "afterbegin",
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
  // scroll only on my messages
  if (from.username === myUsername) tab.scrollTo(0, tab.scrollHeight);
}

// Changes to users tabs selection
//export var userSelectChange$ = new Observable().pipe(startWith("everyone"));
//userSelectChange$.subscribe(data => console.log("from observer " + data))

//-----------------------------------------------------------------------------------
export function addUser(id, username) {
  const active = id === "everyone" ? "active" : "";
  const show = id === "everyone" ? "show" : "";
  document.querySelector(".user-tabs").insertAdjacentHTML(
    "beforeend",
    `
    <li class="nav-item">
      <a class="nav-link ${active}" href="#${id}" data-toggle="tab">
        <div class="specific-username">${username}</div>
      </a>
    </li>
    `
  );

  $(`.nav-tabs a[href="#${id}"]`).on("shown.bs.tab", (event) => {
    currentlySelectedUser = { id: id, username: username };
    console.log(currentlySelectedUser);
  });

  /* let newUserSelect$ = fromEvent(
    $(`.nav-tabs a[href="#${id}"]`),
    "shown.bs.tab"
  ).pipe(map((e) => e.target.href.slice(e.target.href.indexOf("#") + 1)));
  userSelectChange$ = merge(userSelectChange$, newUserSelect$);
  */
  document.querySelector(".user-messages-tabs").insertAdjacentHTML(
    "beforeend",
    `
    <div role="tabpanel" class="tab-pane fade ${active} ${show}" id="${id}"> 
      <div class="pl-2 username border-bottom username">${username}</div>
      <div class="tab-content d-flex flex-column-reverse" id="messages"></div>
    </div>
    `
  );
}

export const clearUsers = () => {
  document.querySelector(".user-tabs").innerHTML = "";
  document.querySelector(".user-messages-tabs").innerHTML = "";
};

export const removeUser = (id) => {
  let tabToRemove = document.querySelector(
    `.user-tabs > li.nav-item > a[href="#${id}"]`
  );
  if (tabToRemove) {
    if (tabToRemove.classList.contains("active"))
      document
        .querySelector(`.user-tabs > li.nav-item > a[href="#${id}"]`)
        .classList.add("active");
    tabToRemove.parentNode.parentNode.removeChild(tabToRemove.parentNode);
  }
  tabToRemove = document.querySelector(`#${id}`);
  if (tabToRemove) {
    if (
      tabToRemove.classList.contains("active") &&
      tabToRemove.classList.contains("show")
    )
      document.querySelector(`#everyone`).classList.add("active", "show");
    tabToRemove.parentNode.removeChild(tabToRemove);
  }
};
