/**
 * Функция для генерации уникального кода, каждые 6 или указанное количество итераций спустя будут установлены "-"
 * @param codeLength количество символов в коде
 * @param dashSkippingCharacters количество символов, которые нужно пропустить для постановки дефиса
 * @return string
 * */

export function generateUniqueCode(codeLength: number = 36, dashSkippingCharacters = 6): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';

  for (let i = 0; i < codeLength; i++) {
    if (dashSkippingCharacters && i % dashSkippingCharacters === 0 && i !== 0) {
      code += '-';
      continue;
    }
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
}
