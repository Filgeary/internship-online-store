
/**
 * Преобразование строки формата UTC в читаемую дату
 * @param dateTime Время в UTC формате
 * @returns Время в формате "ДД.ММ.ГГГГ ЧЧ:ММ"
 */
export default function dateFormater(dateTime: string): string {
  const date = new Date(dateTime);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${day < 10 ? "0" + day : day}.${
    month < 10 ? "0" + month : month
  }.${year} ${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
}
