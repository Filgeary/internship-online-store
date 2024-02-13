/**
 * Генератор чисел с шагом 1
 */
export default function codeGenerator(start: number = 0) {
  return () => ++start;
}
