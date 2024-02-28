/**
 * Исключить все повторяемые значения в массиве
 * @param arr1
 * @param arr2
 */
export default function excludeArray(
  arr1: Array<any>,
  arr2: Array<any>,
  equalityFn: (obj1: object, obj2: object) => boolean
): Array<any> {
  const res = arr2.filter((elem) => {
    return arr1.find((e) => equalityFn(e, elem)) ? false : true;
  });

  return res;
}
