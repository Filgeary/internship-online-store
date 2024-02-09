export type Dictionary = Record<Word, string | PlurableString>;

export type TranslateFunc = (text: Word, number?: number) => string;

export type PlurableString = {
  one?: string;
  few?: string;
  many?: string;
  other?: string;
};

export type Language = "ru" | "en";

export type Word =
  | "title"
  | "menu.main"
  | "basket.title"
  | "basket.open"
  | "basket.close"
  | "basket.inBasket"
  | "basket.empty"
  | "basket.total"
  | "basket.unit"
  | "basket.delete"
  | "basket.articles"
  | "count.title"
  | "count.cancel"
  | "article.add"
  | "filter.reset"
  | "auth.title"
  | "auth.login"
  | "auth.password"
  | "auth.signIn"
  | "session.signIn"
  | "session.signOut";
