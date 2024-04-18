import React, { ChangeEvent, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { io } from "socket.io-client";

type User = {
  id: number;
  name: string;
};
type Message = {
  id: number;
  message: string;
  user: User;
};

const socket = io("http://localhost:3009/", {
  // reconnectionDelayMax: 10000,
});

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("hello");

  const onChangeMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  };
  const onSendMessage = () => {
    socket.emit("client-message-sent", message);
    setMessage("");
  };
  useEffect(() => {
    socket.on("init-messages-published", (messages: Message[]) => {
      setMessages(messages);
    });
  }, []);

  return (
    <div className="App">
      <div>
        {messages.map((m, i) => (
          <div key={i}>
            <div>
              {m.user.name} : {m.message}
            </div>
          </div>
        ))}
      </div>
      <div>
        <textarea
          placeholder="message"
          value={message}
          onChange={onChangeMessage}
        />
      </div>
      <div>
        <button disabled={message === ""} onClick={onSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
