export interface ITokenGenerator {
  getUUID(): string;
  getSecret(): string;
}
