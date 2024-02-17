/**
 * Форматирование разрядов числа
 * @param value {Number}
 * @param options {Object}
 * @returns {String}
 */
export default function numberFormat(value: number, locale = 'ru-RU', options: object = {}): string {
  return new Intl.NumberFormat(locale, options).format(value);
}
