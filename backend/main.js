import { Server } from "socket.io";
import { app } from "./app.js";
import { createServer } from "node:http";

const PORT = 4000;

const http = createServer(app);

const io = new Server(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("new-message", ({ message, socketId }) => {
    console.log(message);

    //el broadcast es para que todos reciban el mensaje menos quien lo envia

    socket.broadcast.emit("new-message", { socketId, message });
  });
});

http.listen(PORT, () => {
  console.log(`server on port ${PORT}`);
});
