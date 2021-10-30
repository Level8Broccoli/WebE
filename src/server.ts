import { DateTime } from "luxon";
import { Server } from "socket.io";
import { Api } from "./backend/api/Api";
import { getAllGames, getAllRegisteredPlayers } from "./backend/services/ServerStateService";
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
  StartGameRequest,
} from "./shared/model/RequestTypes";
import { ErrorResponse, StartMoveResponse } from "./shared/model/ResponseTypes";

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
        io.emit("updatePlayerList", { playerList: getAllRegisteredPlayers(serverState) });
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
        io.emit("updatePlayerList", { playerList: getAllRegisteredPlayers(serverState) });
        io.emit("updateGameList", { gameList: getAllGames(serverState) });
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
        io.emit("updatePlayerList", { playerList: getAllRegisteredPlayers(serverState) });
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
        io.emit("updatePlayerList", { playerList: getAllRegisteredPlayers(serverState) });
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
        io.emit("updateGameList", { gameList: getAllGames(serverState) });
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
        io.emit("updateGameList", { gameList: getAllGames(serverState) });
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
        io.emit("updateGameList", { gameList: getAllGames(serverState) });
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
        io.emit("updateGameList", { gameList: getAllGames(serverState) });
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
      .then((responses) => {
        // Send startGame message with intial gameState and the privat hand to the corresponding player
        for (const response of responses) {
          io.to(api.getSocketId(response.player.id)).emit(
            "startGame",
            response
          );
        }

        // Then broadcast the active player that has to make his move (the last one joined)
        const r: StartMoveResponse = {
          timestamp: DateTime.now(),
          player: {
            id: api.getActivePlayer(request.gameId),
          },
        };
        io.in(request.gameId).emit("startMove", r);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("startGame", response);
      });
  });

  socket.on("drawCard", (request: DrawCardRequest) => {
    api
      .drawCard(request)
      .then((responses) => {
        socket.emit("drawCard", responses[0]);
        io.in(request.gameId).emit("updateGameBoard", responses[1]);
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("startGame", response);
      });
  });

  socket.on("discardCard", (request: DiscardCardRequest) => {
    api
      .discardCard(request)
      .then((response) => {
        // Send updated Gameboard
        io.in(request.gameId).emit("updateGameBoard", response);
        // Check if a Winner exists
      })
      .catch((error) => {
        const response: ErrorResponse = {
          status: error.message,
        };
        socket.emit("startGame", response);
      });
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected ${socket.id}`);
  });
});
