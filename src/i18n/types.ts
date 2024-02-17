import * as trans from './translations/index';

export type LanguageDictionarys = typeof trans;
export type LanguagesKeys= keyof LanguageDictionarys;


export type Translations = {
  [key in LanguagesKeys]: LanguageDictionarys[key]
}


export type Dictionary = {
  "title": string,
  "menu.main": string,
  "basket.title": string,
  "basket.open": string,
  "basket.close": string,
  "basket.inBasket": string,
  "basket.empty": string,
  "basket.total": string,
  "basket.unit": string,
  "basket.delete": string,
  "basket.articles": string,
  "adding.title": string,
  "adding.cancel": string,
  "adding.ok": string,
  "article.add": string,
  "filter.reset": string,
  "auth.title": string,
  "auth.login": string,
  "auth.password": string,
  "auth.signIn": string,
  "session.signIn": string,
  "session.signOut": string,
  "button.addMore": string,
}
