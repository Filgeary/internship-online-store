import isPlainObject from '../is-plain-object';

/**
 * Возвращает объект, в котором не будет совпадений со вторым объектом
 * @param objectSrc {Object} Исходный объект
 * @param objectExc {Object} Объект-маска, вырезаемый из objectSrc
 * @returns {Object} Новый объект
 */
export default function exclude<T, U>(objectSrc: T, objectExc: U): Record<string, any> {
  if (isPlainObject(objectSrc) && isPlainObject(objectExc)) {
    const result: Record<string, any> = {};
    const keys = Object.keys(objectSrc) as (keyof T & keyof U)[];
    for (const key of keys) {
      const src = objectSrc[key] as any;
      const exc = objectExc[key] as any;
      if (src !== exc) {
        const value = exclude(src, exc);
        if (typeof value !== 'undefined') {
          result[key as string] = value;
        }
      }
    }
    return Object.keys(result).length ? result : undefined;
  } else {
    return objectSrc;
  }
}
