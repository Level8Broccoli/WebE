import { ITokenGenerator } from "../util/ITokenGenerator";

export class Room {
  public id: string;
  public creatorId: string;

  constructor(id: string, creatorId: string) {
    this.id = id;
    this.creatorId = creatorId;
  }
}
