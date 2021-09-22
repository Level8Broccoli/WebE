import { Player } from "../server/Player";
import { ServerState } from "../server/ServerState";
import { ITokenGenerator } from "../util/ITokenGenerator";
import moment from "moment";
import { ErrorCode } from "./ErrorCode";

const DATE_TIME_FORMAT = "YYYY-MM-DDThh:mm:ss";

export class Api {
  private _serverState: ServerState;
  private _tokenGenerator: ITokenGenerator;

  constructor(serverState: ServerState, tokenGenerator: ITokenGenerator) {
    this._serverState = serverState;
    this._tokenGenerator = tokenGenerator;
  }

  registerPlayer(request: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const json = JSON.parse(request);

      // [Server] Validation (nicht leer, gültige UTF-8 Zeichen) -> Errorfeedback
      if (json.playerName.length === 0 || json.playerName === "") {
        throw new Error("Player name is empty.");
      }

      // [Server] PlayerId und Secret generieren
      const id = this._tokenGenerator.getUUID();
      const secret = this._tokenGenerator.getSecret();
      const name = json.playerName;

      // [Server] Player in ServerState anlegen
      const player = new Player(id, name, secret);
      this._serverState.registerPlayer(player);

      // [Server] Liste aller aktiven Spielräume abfragen
      const rooms = this._serverState.rooms;

      // [Server] Response senden
      const response = {
        status: ErrorCode.OK,
        timestamp: moment(new Date(), DATE_TIME_FORMAT),
        player: player,
        rooms: rooms,
      };

      resolve(response);
    });
  }
}
