import { v4 as uuidv4 } from "uuid";

export function getUUID(): string {
  return uuidv4();
}

export function getSecret(): string {
  return uuidv4();
}
