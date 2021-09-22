import { Server } from "socket.io";

const PORT: number = 3000;

const io = new Server(PORT, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Connected ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Disconnected ${socket.id}`);
  });
});
