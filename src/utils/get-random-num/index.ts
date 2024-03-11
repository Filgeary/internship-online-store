/**
 * Получить случайное число от min до max
 * @param min {number} Минимальное число
 * @param max {number} Максимальное число
 * @returns number;
 */
function getRandomNum(min: number, max: number) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

export default getRandomNum;
