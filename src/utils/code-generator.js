/**
 * Генератор чисел с шагом 1
 * @returns {Function}
 */
export default function codeGenerator(start = 0) {
  return () => ++start;
}
