import * as translations from "./translations";
import { Language, PlurableString, TranslationKey } from "./types";

export default function translate(
  lang: Language,
  text: TranslationKey,
  plural?: number
): string {
  if (typeof plural !== "undefined") {
    let result = translations[lang][text] as PlurableString;
    const key = new Intl.PluralRules(lang).select(plural);
    return result[key];
  }
  return translations[lang][text] as string;
}
