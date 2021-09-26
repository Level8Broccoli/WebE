import { PrivatePlayer } from "../../model/Player";
import { Room, SimpleRoom } from "../../model/Room";
import { ServerState } from "../../model/ServerState";

export function registerPlayer(
  serverState: ServerState,
  player: PrivatePlayer
) {
  serverState.players.push(player);
}

export function createGame(serverState: ServerState, room: Room) {
  serverState.rooms.push(room);
}

export function playerExists(
  serverState: ServerState,
  player: PrivatePlayer
): boolean {
  // Find player with correct id and secret pair
  const found = serverState.players.find(
    (p) => p.id === player.id && p.secret === player.secret
  );

  return found !== undefined ? true : false;
}

export function canRoomBeDeleted(
  serverState: ServerState,
  room: SimpleRoom,
  player: PrivatePlayer
): boolean {
  // Find room with correct roomId and creatorId pair
  const found = serverState.rooms.find(
    (r) => r.id === room.id && r.creatorId === player.id
  );

  return found !== undefined ? true : false;
}

export function deleteGame(serverState: ServerState, room: SimpleRoom) {
  serverState.rooms = serverState.rooms.filter((r) => r.id !== room.id);
}

export function roomExists(
  serverState: ServerState,
  room: SimpleRoom
): boolean {
  const found = serverState.rooms.find((r) => r.id === room.id);

  return found !== undefined ? true : false;
}

export function isFreePlaceInRoomAvailabe(
  serverState: ServerState,
  room: SimpleRoom
): boolean {
  const r = serverState.rooms.find((r) => r.id === room.id);
  if (r === undefined) {
    return false;
  }
  return r.players.length < r.roomConfig.maxPlayerCountForRoom ? true : false;
}

export function joinGame(
  serverState: ServerState,
  player: PrivatePlayer,
  room: SimpleRoom
) {
  const r = serverState.rooms.find((r) => r.id === room.id);
  r?.players.push(player.id);
}
