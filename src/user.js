export class User {
  constructor(
    username,
    userID,
    password = null,
    messages = null,
    socket = null
  ) {
    this.username = username;
    this.userID = userID;
    this.password = password;
    this.messages = [];
  }
}
