import isPlainObject from '../is-plain-object';

type MyObject = {
  [key: string]: any;
};


/**
 * Возвращает объект, в котором не будет совпадений со вторым объектом
 * @param objectSrc {Object} Исходный объект
 * @param objectExc {Object} Объект-маска, вырезаемый из objectSrc
 * @returns {Object} Новый объект
 */
export default function exclude(objectSrc: MyObject, objectExc: MyObject): Record<string, string> {
  if (isPlainObject(objectSrc) && isPlainObject(objectExc)) {
    const result = {} as MyObject;
    const keys = Object.keys(objectSrc);
    for (const key of keys) {
      if (objectSrc[key] !== objectExc[key]) {
        const value = exclude(objectSrc[key], objectExc[key])
        if (typeof value !== "undefined") {
          result[key] = value;
        }
      }
    }
    return Object.keys(result).length ? result : {} as Record<string, string>;
  } else {
    return objectSrc as Record<string, string>;
  }
}
