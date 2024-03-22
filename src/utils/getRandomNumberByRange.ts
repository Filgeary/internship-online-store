export function getRandomNumberByRange(min: number, max: number) {
  return +(Math.random() * (max - min) + min).toFixed(2);
}
