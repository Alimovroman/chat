import React, {
  ChangeEvent,
  UIEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import {
  createConnection,
  destroyConnection,
  sendMessage,
  sendName,
  typeMessage,
} from "../chat-reducer";
import { useDispatch, useSelector } from "react-redux";
import { AppRootState } from "./store";

function App() {
  // const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("hello");
  const [name, setName] = useState("");
  const [isSendName, setIsSendName] = useState(false);
  const messagesAncorRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const messages = useSelector((state: AppRootState) => state.chat.messages);
  const typingUsers = useSelector(
    (state: AppRootState) => state.chat.typingUsers
  );
  const dispatch = useDispatch();

  const onChangeMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  };
  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };
  const onSendName = () => {
    dispatch(sendName(name));
    setIsSendName(true);
  };
  const onSendMessage = () => {
    dispatch(sendMessage(message));
    setMessage("");
  };
  const onShowMessage = () => {
    dispatch(typeMessage());
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
    dispatch(createConnection());

    return () => {
      dispatch(destroyConnection());
    };
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
          <div key={m.id}>
            <div>
              {m.user.name} : {m.message}
              <hr />
            </div>
          </div>
        ))}
        {typingUsers.map((u, i) => (
          <div key={u.id}>
            <div>
              {u.name} : ...
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
          onKeyPress={onShowMessage}
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
