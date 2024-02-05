/**
 * Генератор уникальной последовательности символов
 * @returns String
 */
export default function generateHash(): string {
  return Math.floor(Math.random() * Date.now()).toString(16);
}
