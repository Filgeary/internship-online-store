import {Locale} from "../../types/Locale";

/**
 * Форматирование разрядов числа
 * @param value {Number}
 * @param locale {string}
 * @param options {Object}
 * @returns {String}
 */
export default function numberFormat(value: number, locale: Locale = 'ru-RU', options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat(locale, options).format(value);
}
