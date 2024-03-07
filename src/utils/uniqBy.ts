export function uniqBy<T>(arr: T[], fn: (item: T) => any) {
  const set = new Set();

  return arr.filter(item => {
    const key = fn(item);
    if (set.has(key)) {
      return false;
    }
    set.add(key);
    return true;
  });
}
