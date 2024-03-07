export function sortByDate<T extends { dateCreate: Date }>(a: T, b: T): number {
  return new Date(a.dateCreate).getTime() - new Date(b.dateCreate).getTime();
}
