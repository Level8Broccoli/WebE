import * as mongoDB from "mongodb";
import { Game } from "../../shared/model/Game";

const DB_CONN_STRING = "mongodb+srv://level8:level8@ffhs.ajxx1.mongodb.net";
const DB_NAME = "level8";
const GAMES_COLLECTION_NAME = "games";

async function connectDb() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING);

  await client.connect();

  return client.db(DB_NAME!);
}

export async function persistGame(game: Game, winnerId: string) {
  const db = connectDb();
  const gamesCollection: mongoDB.Collection = (await db).collection(
    GAMES_COLLECTION_NAME!
  );

  const g = {
    gameId: game.id,
    players: game.players,
    winnerId: winnerId,
  };

  gamesCollection.insertOne(g);
}
