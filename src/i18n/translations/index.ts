import ru from "./ru.json";
import en from "./en.json";

type TKey = {
  [key: string]: string | { [pluralKey: string]: string };
};

type TDictionary = {
  en: TKey;
  ru: TKey;
};

export type TDictionaryKeys = keyof typeof en | keyof typeof ru;

const translations: TDictionary = { en, ru };

export default translations;
