import isPlainObject from '../is-plain-object';

/**
 * Возвращает объект, в котором не будет совпадений со вторым объектом
 * @param objectSrc {Object} Исходный объект
 * @param objectExc {Object} Объект-маска, вырезаемый из objectSrc
 * @returns {Object} Новый объект
 */
export default function exclude(objectSrc: Record<string, any>, objectExc: Record<string, any>) {
  if (isPlainObject(objectSrc) && isPlainObject(objectExc)) {
    const result: Record<string, any> = {};
    const keys = Object.keys(objectSrc);
    for (const key of keys) {
      if (objectSrc[key] !== objectExc[key]) {
        const value = exclude(objectSrc[key], objectExc[key])
        if (typeof value !== "undefined") {
          result[key] = value;
        }
      }
    }
    return Object.keys(result).length ? result : undefined;
  } else {
    return objectSrc;
  }
}
