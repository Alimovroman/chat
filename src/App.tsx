import React, {
  ChangeEvent,
  UIEvent,
  useEffect,
  useRef,
  useState,
} from "react";
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
  const [name, setName] = useState("");
  const [isSendName, setIsSendName] = useState(false);
  const messagesAncorRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const onChangeMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  };
  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };
  const onSendName = () => {
    socket.emit("send-name-user", name);
    setIsSendName(true);
  };
  const onSendMessage = () => {
    socket.emit("client-message-sent", message);
    setMessage("");
  };
  const onAutoScrollChange = (e: UIEvent) => {
    let maxScrollHeight =
      e.currentTarget.scrollHeight - e.currentTarget.clientHeight;
    if (
      e.currentTarget.scrollTop > lastScrollTop &&
      Math.abs(maxScrollHeight - e.currentTarget.scrollTop) < 10
    ) {
      setIsAutoScroll(true);
    } else {
      setIsAutoScroll(false);
    }
    setLastScrollTop(e.currentTarget.scrollTop);
  };

  useEffect(() => {
    socket.on("init-messages-published", (messages: Message[]) => {
      setMessages(messages);
    });
    socket.on("new-messages-send", (message: Message) => {
      setMessages((state) => [...state, message]);
    });
  }, []);
  useEffect(() => {
    if (isAutoScroll) {
      messagesAncorRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="App">
      <div
        style={{
          width: "200px",
          height: "300px",
          border: "1px solid black",
          overflow: "scroll",
        }}
        onScroll={onAutoScrollChange}
      >
        {messages.map((m, i) => (
          <div key={i}>
            <div>
              {m.user.name} : {m.message}
              <hr />
            </div>
          </div>
        ))}
        <div ref={messagesAncorRef} />
      </div>
      <div>
        <input value={name} onChange={onChangeName} />
        <button disabled={name === ""} onClick={onSendName}>
          send name
        </button>
      </div>
      <div>
        <textarea
          placeholder="message"
          value={message}
          onChange={onChangeMessage}
        />
      </div>
      <div>
        <button
          disabled={message === "" || !isSendName}
          onClick={onSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
