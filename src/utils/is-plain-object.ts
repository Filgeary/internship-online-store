/**
 * Проверка, значение - простой объект
 * @param value
 * @returns {boolean}
 */
export default function isPlainObject(value: unknown): boolean {
  return (
    value &&
    typeof value === 'object' &&
    Object.getPrototypeOf(value) === Object.prototype
  ) as boolean;
}
