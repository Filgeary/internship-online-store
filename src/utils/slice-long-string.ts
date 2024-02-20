/**
 * Обрезать длинную строку
 */
function sliceLongString(str: string, maxLength = 22, last = '...'): string {
  const res = str.trim();

  if (res.length < maxLength) return res;
  return res.slice(0, maxLength) + last;
}

export default sliceLongString;
