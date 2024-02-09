import * as translations from "./translations";
import { Language, Word } from "./types";

export default function translate(
  lang: Language,
  text: Word,
  plural?: number
): string {
  let result = translations[lang][text];

  if (typeof plural !== "undefined") {
    const key = new Intl.PluralRules(lang).select(plural);
    result = result[key];
  }

  return result as string;
}
