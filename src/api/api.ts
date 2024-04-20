import { Socket, io } from "socket.io-client";
import { Message, User } from "../chat-reducer";

export const api = {
  socket: null as null | Socket,
  createConnection() {
    this.socket = io("http://localhost:3009/");
  },
  destroyConnection() {
    this.socket?.disconnect();
    this.socket = null;
  },
  subscribe(
    initMessagesHandler: (messages: Message[]) => void,
    sendMessageHandler: (message: Message) => void,
    userTypingHandler: (user: User) => void
  ) {
    this.socket?.on("init-messages-published", initMessagesHandler);
    this.socket?.on("new-messages-send", sendMessageHandler);
    this.socket?.on("user-is-typing", userTypingHandler);
  },
  sendName(name: string) {
    this.socket?.emit("send-name-user", name);
  },
  sendMessage(message: string) {
    this.socket?.emit("client-message-sent", message);
  },
  typeMessage() {
    this.socket?.emit("client-type-message");
  },
};
