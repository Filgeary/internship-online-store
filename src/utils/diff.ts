export function diff<T>(arr1: T[], arr2: T[]) {
  return arr1.filter(x => !arr2.includes(x)).concat(arr2.filter(x => !arr1.includes(x)));
}
