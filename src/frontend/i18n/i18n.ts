import * as de from "./de.json";
import * as en from "./en.json";

export enum Language {
  GERMAN,
  ENGLISH,
}

export const i18n = (lang: Language) => {
  switch (lang) {
    case Language.GERMAN:
      return de;
    case Language.ENGLISH:
      return en;
    default:
      throw new Error("Unknown language");
  }
};
