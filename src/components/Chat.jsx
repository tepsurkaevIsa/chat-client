import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import icon from "../images/emoji.svg";
import styles from "../styles/Chat.module.css";
import Messages from "./Messages";

const socket = io.connect("https://chat-server-bye0.onrender.com/");

const Chat = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState({ room: "", user: "" });
  const [state, setState] = useState([]);
  const [message, setMessage] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [users, setUsers] = useState(0);

  console.log("sss", state)

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    socket.emit("join", searchParams);
    fetchMessagesFromServer();
  }, [search, message]);

  useEffect(() => {
    socket.on("message", ({ data }) => {
      console.log(data)
      setState((_state) => [..._state, data]);
    });
  }, []);

  useEffect(() => {
    socket.on("room", ({ data: { users } }) => {
      setUsers(users.length);
    });
  }, []);

  const fetchMessagesFromServer = async () => {
    try {
      const room = Object.fromEntries(new URLSearchParams(search)).room
     
      const response = await fetch(`https://chat-server-bye0.onrender.com/messages/${room}`);
      const data = await response.json();
      setState(data); // Update state with messages from server
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const leftRoom = () => {
    socket.emit("leftRoom", { params });
    navigate("/");
  };

  const handleChange = ({ target: { value } }) => setMessage(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;
    socket.emit("sendMessage", { message, params });
    setMessage("");

  };

  const onEmojiClick = ({ emoji }) => setMessage(`${message} ${emoji}`);

  return (
    
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}> имя чата: {params.room}</div>
        <div className={styles.users}> пользователей в сети: {users}</div>
        <button className={styles.left} onClick={leftRoom}>
          Покинуть комнату
        </button>
      </div>
      <div className={styles.messages}>
        {/* { console.log(state)} */}
        <Messages messages={state} name={params.name} />
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.input}>
          <input
            type="text"
            name="message"
            placeholder="Что ты хочешь сказать?"
            value={message}
            onChange={handleChange}
            autoComplete="off"
            required
          />
        </div>
        <div className={styles.emoji}>
          <img src={icon} alt="" onClick={() => setOpen(!isOpen)} />
          {isOpen && (
            <div className={styles.emojies}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
        <div className={styles.button}>
          <input type="submit" value="Отправить сообщение" />
        </div>
      </form>
    </div>
  );
};

export default Chat;
