/**
 * Форматирование разрядов числа
 * @param value {Number}
 * @param locale {string}
 * @param options {Object}
 * @returns {String}
 */
export default function numberFormat(value, locale = 'ru-RU', options = {}) {
  return new Intl.NumberFormat(locale, options).format(value);
}
