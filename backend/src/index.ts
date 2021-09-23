import { Server } from "socket.io";
import { Api } from "./api/Api";
import { ErrorCode } from "./api/ErrorCode";
import { ServerState } from "./server/ServerState";
import { ITokenGenerator } from "./util/ITokenGenerator";
import { TokenGenerator } from "./util/TokenGenerator";

const PORT: number = 3000;
const serverState: ServerState = new ServerState();
const tokenGenerator: ITokenGenerator = new TokenGenerator();
const api: Api = new Api(serverState, tokenGenerator);

const io = new Server(PORT, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Connected ${socket.id}`);

  // Register new player endpoint
  socket.on("registerPlayer", (request) => {
    api
      .registerPlayer(request)
      .then((response) => {
        socket.emit("registerPlayer", response);
      })
      .catch((error) => {
        const response = {
          status: ErrorCode.ERROR,
          message: error.message,
        };
        socket.emit("registerPlayer", response);
      });
  });

  // Create new game endpoint
  socket.on("createGame", (request) => {
    api
      .createGame(request)
      .then((response) => socket.emit("createGame", response))
      .catch((error) => {
        const response = {
          status: ErrorCode.ERROR,
          message: error.message,
        };
        socket.emit("registerPlayer", response);
      });
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected ${socket.id}`);
  });
});
