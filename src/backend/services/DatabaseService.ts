import * as mongoDB from "mongodb";
import { Game } from "../../shared/model/Game";
import { LeaderboardEntry } from "../../shared/model/Leaderboard";
import { PublicPlayer } from "../../shared/model/Player";

const DB_CONN_STRING = "mongodb+srv://level8:level8@ffhs.ajxx1.mongodb.net";
const DB_NAME = "level8";
const GAMES_COLLECTION_NAME = "games";

async function connectDb() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING);

  await client.connect();

  return client.db(DB_NAME!);
}

export async function persistGame(game: Game, winner: PublicPlayer) {
  const db = connectDb();
  const gamesCollection: mongoDB.Collection = (await db).collection(
    GAMES_COLLECTION_NAME!
  );

  const g = {
    gameId: game.id,
    players: game.players,
    winner: winner,
  };

  gamesCollection.insertOne(g);
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const db = connectDb();
  const gamesCollection: mongoDB.Collection = (await db).collection(
    GAMES_COLLECTION_NAME!
  );

  return gamesCollection
    .aggregate<LeaderboardEntry>([
      {
        $group: {
          _id: "$winner",
          wins: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id.name",
          wins: "$wins",
        },
      },
      {
        $sort: {
          wins: -1,
        },
      },
      { $limit: 10 },
    ])
    .toArray();
}
