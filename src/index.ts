const input: HTMLInputElement = document.querySelector("input");
const sendButton: HTMLElement = document.getElementById("send-message");

sendButton.onclick = () => {
  if (input.value.trim() !== "") appendMessage();
  input.focus();
};
input.onkeypress = (ev) => {
  if ((ev.keyCode === 13 || ev.which === 13) && input.value.trim() !== "") {
    appendMessage();
  }
};
function appendMessage() {
  let message = `
                <div class="d-flex flex-row-reverse mx-2">
                  <div class="message
                              my-message
                              text-break
                              px-3
                              py-2
                              my-1
                              mx-2
                              text-left">${input.value}
                  </div>
                  <div class="spacer"></div>
                </div>
                `;
  document.getElementById("messages").insertAdjacentHTML("afterbegin", message);
  input.value = "";
}

/*
  <li class="nav-item">
    <a class="nav-link" href="#IDStefan" data-toggle="tab">
      <div class="specific-username">Stefan</div>
    </a>
    </li>
*/
