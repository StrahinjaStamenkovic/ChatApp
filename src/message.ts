export class Message {
  public to: any;
  public from: any;
  public payload: string;
  public dateSent: Date;
  constructor(
    from: any,
    payload: string,
    to: any,
    dateSent: number = Date.now()
  ) {
    this.to = to;
    this.from = from;
    this.payload = payload;
    this.dateSent = new Date(dateSent);
  }
}
// module.exports = {
//   Message,
// };
