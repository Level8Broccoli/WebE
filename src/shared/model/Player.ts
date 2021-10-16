export interface SimplePlayer {
  id: string;
}

export interface PublicPlayer extends SimplePlayer {
  name: string;
}

export interface PrivatePlayer extends PublicPlayer {
  secret: string;
}

export interface FullPlayer extends PrivatePlayer {
  socketId: string;
}
