import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import styles from "../styles/Main.module.css";

const FIELDS = {
  NAME: "name",
  ROOM: "room",
};

const Main = () => {
  const { NAME, ROOM } = FIELDS;
  const navigate = useNavigate();

  const [values, setValues] = useState({ [NAME]: "", [ROOM]: "" });

  const handleChange = ({ target: { value, name } }) => {
    setValues({ ...values, [name]: value });
  };

  const handleClick = (e) => {
    e.preventDefault();

    // Создаем подключение к серверу через WebSocket
    const socket = io("https://chat-server-bye0.onrender.com/");

    // Отправляем данные на сервер
    socket.emit("join", { name: values[NAME], room: values[ROOM] });

    // Переходим на страницу чата с передачей данных через параметры маршрута
    navigate(`/chat?name=${values[NAME]}&room=${values[ROOM]}`);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Join</h1>

        <form className={styles.form}>
          <div className={styles.group}>
            <input
              type="text"
              name="name"
              value={values[NAME]}
              placeholder="Username"
              className={styles.input}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <div className={styles.group}>
            <input
              type="text"
              name="room"
              placeholder="Room"
              value={values[ROOM]}
              className={styles.input}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>

          {/* Заменили Link на кнопку с обработчиком */}
            <button
              className={`${styles.group} ${styles.button}`}
              onClick={handleClick}
              type="submit"
            >
              Sign In
            </button>
        </form>
      </div>
    </div>
  );
};

export default Main;
