import { ITokenGenerator } from "./ITokenGenerator";
import { v4 as uuidv4 } from "uuid";

export class TokenGenerator implements ITokenGenerator {
  getUUID(): string {
    return uuidv4();
  }
}
