import { Server } from "socket.io";
import { Api } from "./backend/api/Api";
import {
  ChatRequest,
  CreateGameRequest,
  DeleteGameRequest,
  DiscardCardRequest,
  DrawCardRequest,
  EditPlayerNameRequest,
  JoinGameRequest,
  LeaveGameRequest,
  LogoutRequest,
  RegisterExistingPlayerRequest,
  RegisterPlayerRequest,
  StartGameRequest
} from "./shared/model/RequestTypes";
import { ErrorResponse, StartGameResponse, UpdateGameBoardResponse } from "./shared/model/ResponseTypes";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3030;
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
      .registerPlayer(request, socket.id)
      .then((response) => {
        socket.emit("registerPlayer", response);
        io.emit("updatePlayerList", { playerList: api.getAllPlayers() });
        console.log(`>>> Registered Player ${response.player.id}`);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("registerPlayer", response);
      });
  });

  socket.on("logout", (request: LogoutRequest) => {
    api
      .logoutPlayer(request)
      .then((response) => {
        socket.emit("logout", response);
        io.emit("updatePlayerList", { playerList: api.getAllPlayers() });
        io.emit("updateGameList", { gameList: api.getAllGames() });
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("logout", response);
      });
  });

  socket.on("registerExistingPlayer", (request: RegisterExistingPlayerRequest) => {
    api
      .registerExistingPlayer(request, socket.id)
      .then((response) => {
        socket.emit("registerExistingPlayer", response);
        io.emit("updatePlayerList", { playerList: api.getAllPlayers() });
        if (response.activeGameId.length > 0) {
          socket.join(response.activeGameId);
        }
        console.log(`>>> Registered Existing Player ${response.player.id}`);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("registerExistingPlayer", response);
      });
  });

  socket.on("editPlayerName", (request: EditPlayerNameRequest) => {
    api
      .editPlayerName(request)
      .then((response) => {
        io.emit("updatePlayerList", { playerList: api.getAllPlayers() });
        socket.emit("editPlayerName", response);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("editPlayerName", response);
      });
  });

  socket.on("createGame", (request: CreateGameRequest) => {
    api
      .createGame(request)
      .then((response) => {
        socket.join(response.game.id);
        io.emit("createGame", response);
        io.emit("updateGameList", { gameList: api.getAllGames() });
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
        socket.leave(response.gameId);
        io.emit("deleteGame", response);
        io.emit("updateGameList", { gameList: api.getAllGames() });
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
        io.emit("updateGameList", { gameList: api.getAllGames() });
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
        socket.leave(response.gameId);
        io.emit("leaveGame", response);
        io.emit("updateGameList", { gameList: api.getAllGames() });
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
        socket.emit("chat", response);
        socket.to(request.gameId).emit("chat", response);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("chat", response);
      });
  });

  socket.on("startGame", (request: StartGameRequest) => {
    api
      .startGame(request)
      .then((response) => {
        broadcastUpdateGameState(response.gameId);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("startGame", response);
      });
  });

  socket.on("drawCard", (request: DrawCardRequest) => {
    console.log("receive drawCard");

    api
      .drawCard(request)
      .then((response) => {
        broadcastUpdateGameState(response.gameId);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("startGame", response);
      });
  });

  socket.on("discardCard", (request: DiscardCardRequest) => {
    console.log("receive discardCard");

    api
      .discardCard(request)
      .then((response) => {
        broadcastUpdateGameState(response.gameId);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("discardCard", response);
      });
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected ${socket.id}`);
  });
});

function broadcastUpdateGameState(gameId: string) {
  const playerIdList = api.getPlayerIdListFromGame(gameId);
  for (const playerId of playerIdList) {
    const socketId = api.getSocketId(playerId);
    io.to(socketId).emit("updateGameList", { gameList: api.getAllGames(playerId) });
  }
}
