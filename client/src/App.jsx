import { useEffect } from "react";
import { useState } from "react";
import io from "socket.io-client";
const ws = io("http://localhost:4000");

export const App = () => {
  const [messageList, setMessageList] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessageList((prev) => [...prev, { socketId: ws.id, message }]);
    const message = e.target[0].value;
    console.log(message);
    ws.emit("new-message", { message, socketId: ws.id });

    e.target.reset();
  };
  useEffect(() => {
    ws.on("new-message", (message, socketId) => {
      console.log("se recibión un mensaje del servidor", message);

      //el prev es para obtener el estadoanterior
      setMessageList((prev) => [...prev, { socketId, message }]);
    });

    return () => {
      ws.off("new-message");
    };
  });
  return (
    <div className="flex min-h-screen flex-col px-2 pb-2 overflow-hidden max-h-screen">
      <div className="flex-1 overflow-y-scroll">
        <ul>
          {messageList.map(({ socketId, message }) => (
            <li
              key={socketId}
              className={
                socketId === ws.id
                  ? "bg-green-400 text-white self-end"
                  : "bg-green-800 text-white self-start"
              }
            >
              {message}
            </li>
          ))}
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};
