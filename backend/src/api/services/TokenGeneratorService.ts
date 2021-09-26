import { v4 as uuidv4 } from "uuid";

const SECRET_LENGTH = 12;

export function getUUID(): string {
  return uuidv4();
}

export function getSecret(): string {
  return _randomNumber(SECRET_LENGTH).toString();
}

function _randomNumber(n: number): number {
  // https://stackoverflow.com/questions/21816595/how-to-generate-a-random-number-of-fixed-length-using-javascript

  var add = 1,
    max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if (n > max) {
    return _randomNumber(max) + _randomNumber(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10; // Math.pow(10, n) basically
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return number + add;
}
