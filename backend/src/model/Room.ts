export type Room = {
  id: string;
  creatorId: string;
  players: string[];
  roomConfig: RoomConfig;
};

export type SimpleRoom = {
  id: string;
};

export type RoomConfig = {
  maxPlayerCountForRoom: number;
};
