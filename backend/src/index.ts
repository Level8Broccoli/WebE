import { Server } from "socket.io";
import { Api } from "./api/Api";
import { StatusCode } from "./api/StatusCode";
import {
  ChatRequest,
  CreateGameRequest,
  DeleteGameRequest,
  EditPlayerNameRequest,
  JoinGameRequest,
  LeaveGameRequest,
  RegisterPlayerRequest,
} from "./model/RequestTypes";
import { ErrorResponse } from "./model/ResponseTypes";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const serverState = {
  players: [],
  games: [],
};
const api = new Api(serverState);

const io = new Server(PORT, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Connected ${socket.id}`);

  socket.on("registerPlayer", (request: RegisterPlayerRequest) => {
    api
      .registerPlayer(request)
      .then((response) => {
        socket.emit("registerPlayer", response);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("registerPlayer", response);
      });
  });

  socket.on("editPlayerName", (request: EditPlayerNameRequest) => {
    api
      .editPlayerName(request)
      .then((response) => {
        socket.emit("editPlayerName", response);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("registerPlayer", response);
      });
  });

  socket.on("createGame", (request: CreateGameRequest) => {
    api
      .createGame(request)
      .then((response) => {
        socket.join(response.game.id);
        io.emit("createGame", response);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("createGame", response);
      });
  });

  socket.on("deleteGame", (request: DeleteGameRequest) => {
    api
      .deleteGame(request)
      .then((response) => {
        socket.leave(response.game.id);
        io.emit("deleteGame", response);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("deleteGame", response);
      });
  });

  socket.on("joinGame", (request: JoinGameRequest) => {
    api
      .joinGame(request)
      .then((response) => {
        socket.join(response.game.id);
        io.emit("joinGame", response);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("joinGame", response);
      });
  });

  socket.on("leaveGame", (request: LeaveGameRequest) => {
    api
      .leaveGame(request)
      .then((response) => {
        socket.leave(response.game.id);
        io.emit("leaveGame", response);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("leaveGame", response);
      });
  });

  socket.on("chat", (request: ChatRequest) => {
    api
      .chat(request)
      .then((response) => {
        socket.to(request.game.id).emit("chat", response.message);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("chat", response);
      });
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected ${socket.id}`);
  });
});
