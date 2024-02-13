/**
 * Форматирование разрядов числа
 */
export default function numberFormat(value: number, locale: string = 'ru-RU', options: object = {}): string {
  return new Intl.NumberFormat(locale, options).format(value);
}
