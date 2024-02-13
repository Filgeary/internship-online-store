/**
 * Проверка, значение - простой объект
 */
export default function isPlainObject(value: any): boolean {
  return value && (!value.__proto__ || Object.getPrototypeOf(value).constructor.name === 'Object');
}
