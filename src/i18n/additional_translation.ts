import { any, string } from "prop-types"
import "@total-typescript/ts-reset";

const translations = {
  en: {
    title: "Shop",
    menu: {
      main: "Main",
    },
    basket: {
      title: "Cart",
      open: "Open",
      close: "Close",
      inBasket: "In cart",
      empty: "empty",
      total: "Total",
      unit: "pcs",
      delete: "Delete",
      articles: {
        one: "article",
        other: "articles",
      },
    },
  },
  ru: {
    title: "Магазин",
    menu: {
      main: "Главная",
    },
    basket: {
      title: "Корзина",
      bopen: "Перейти",
      close: "Закрыть",
      inBasket: "В корзине",
      empty: "пусто",
      total: "Итого",
      unit: "шт",
      delete: "Удалить",
      articles: {
        one: "товар",
        few: "товара",
        many: "товаров",
        other: "товара",
      },
    },
  },
};

// Types
export type ILangs = "ru" | "en";

// Рекурсивно получаем все конечные ключи объекта translations
type FlattenKeys<T, P extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? FlattenKeys<T[K], `${P}${P extends '' ? '' : '.'}${K}`>
        : `${P}${P extends '' ? '' : '.'}${K}`;
    }[keyof T & string]
  : never;

// Получаем ключи объекта translations без указания языка
type AllKeys = FlattenKeys<typeof translations['en']>;

// Удаляем дубликаты ключей с приставкой "basket.articles"
type RemoveBasketArticlesDuplicates<T extends string> = T extends `basket.articles.${infer Key}`
  ? Key extends keyof typeof translations['ru']['basket']['articles']
    ? "basket.articles"
    : T
  : T;

// Создаем тип для всех переводов без указания языка и дубликатов ключей
export type IAllTranslations = RemoveBasketArticlesDuplicates<AllKeys>;


export type ITranslateFn = (
  lang: ILangs,
  text: IAllTranslations, 
  plural?: number
) => string;

type TranslationsLang = {
  [key: string]: string | { 
    [key: string]: string | { 
      [key: string]: string | { 
        [key: string]: string | object }} }
}

export const translate: ITranslateFn = (lang, text, plural): string => {

  const translation = translations[lang] as TranslationsLang
  let newTranslations: TranslationsLang = {}

  for (let key in translation as TranslationsLang) {
    if(typeof translation[key] === 'string') {
      newTranslations[key] = translation[key] as IAllTranslations
    } else {
    const objectKey = translation[key] as TranslationsLang
    for(let childrenKey in objectKey) {
      newTranslations[`${key}.${childrenKey}`] = objectKey[childrenKey] 
    }
  }
  }

  let result = text in newTranslations ? newTranslations[text] : text
   
  if (typeof plural !== "undefined" && typeof result === "object") {
    const key = new Intl.PluralRules(lang).select(plural);

    if (key in result) {
      result = result[key as keyof typeof result] as any
    }
  }

  console.log('РЕЗУЛЬТАТ ТЕСТОВОЙ ФУНКЦИИ', result)
  return String(result);
};

export default translate;