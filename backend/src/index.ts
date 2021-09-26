import { Server } from "socket.io";
import { Api } from "./api/Api";
import { ErrorCode } from "./api/ErrorCode";
import { ErrorResponse } from "./model/ResponseTypes";
import { ServerState } from "./model/ServerState";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const serverState = {
  players: [],
  rooms: [],
};
const api = new Api(serverState);

const io = new Server(PORT, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Connected ${socket.id}`);

  // Register new player endpoint
  socket.on("registerPlayer", (request: string) => {
    api
      .registerPlayer(JSON.parse(request))
      .then((response) => {
        socket.emit("registerPlayer", response);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: ErrorCode.ERROR,
          message: error.message,
        };
        socket.emit("registerPlayer", response);
      });
  });

  // Create new game endpoint
  socket.on("createGame", (request) => {
    api
      .createGame(JSON.parse(request))
      .then((response) => {
        // Broadcast to all connected sockets
        io.emit("createGame", response);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: ErrorCode.ERROR,
          message: error.message,
        };
        socket.emit("createGame", response);
      });
  });

  // Delete created game endpoint
  socket.on("deleteGame", (request) => {
    api
      .deleteGame(JSON.parse(request))
      .then((response) => {
        // Broadcast to all connected sockets
        io.emit("deleteGame", response);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: ErrorCode.ERROR,
          message: error.message,
        };
        socket.emit("deleteGame", response);
      });
  });

  // Join game endpoint
  socket.on("joinGame", (request) => {
    api
      .joinGame(JSON.parse(request))
      .then((response) => {
        // Broadcast to all connected sockets
        io.emit("joinGame", response);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: ErrorCode.ERROR,
          message: error.message,
        };
        socket.emit("joinGame", response);
      });
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected ${socket.id}`);
  });
});
