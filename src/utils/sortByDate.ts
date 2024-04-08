export function sortByDate<T extends { dateCreate: string }>(a: T, b: T): number {
  return new Date(a.dateCreate).getTime() - new Date(b.dateCreate).getTime();
}
