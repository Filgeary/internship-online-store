import translations, {KeysTranslationsAll, Lang, TextTranslate} from "@src/ww-old-i18n-postponed/translations";

/**
 * Перевод фразу по словарю
 */
export default function translate(lang: Lang, text: KeysTranslationsAll, plural?: number): string {
  const result = translations[lang][text as TextTranslate];
  //Если тип строка, то возвращает значение
  if (typeof result === 'string') return result;
  // Если предыдущее условие не сработало, то проверяем является ли plural числом и если да то делаем ключ по которому можно получить перевод с плюрализацией если же по ключу перевода не найдено, то берем значение из .one, который должен быть всегда
  if (typeof plural === 'number' && typeof result === 'object') {
    const key = new Intl.PluralRules(lang).select(plural);
    return result[key] || text;
  }
  return text;
}
