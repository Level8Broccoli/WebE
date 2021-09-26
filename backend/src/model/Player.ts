export interface PublicPlayer {
  id: string;
  name: string;
}

export interface PrivatePlayer extends PublicPlayer {
  secret: string;
}
