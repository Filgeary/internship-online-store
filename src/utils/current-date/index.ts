export default function getCurrentTime(): string {
    // Создаем новый объект Date, который содержит текущую дату и время
    const currentDate: Date = new Date();

    // Получаем текущее время в формате часы:минуты:секунды
    let hours: number | string = currentDate.getHours();
    let minutes: number | string = currentDate.getMinutes();
    let seconds: number | string = currentDate.getSeconds();

    // Форматируем вывод, чтобы добавить ведущий ноль, если число меньше 10
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    // Возвращаем текущее время в формате "часы:минуты:секунды"
    return `${hours}:${minutes}:${seconds}`;
}


