/**
 * Генератор уникальной последовательности символов
 * @returns String
 */
export default function generateHash() {
  return Math.floor(Math.random() * Date.now()).toString(16);
}
