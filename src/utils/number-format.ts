/**
 * Форматирование разрядов числа
 * @param value {Number}
 * @param locale {String}
 * @param options {Object}
 * @returns {String}
 */
function numberFormat(
  value: number,
  locale: string = 'ru-RU',
  options: object = {}
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export default numberFormat;
