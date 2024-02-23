function dateFormat(date: Date): string {
  const formatter = new Intl.DateTimeFormat('ru', {
    month: 'numeric',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  return formatter.format(date);
}

export default dateFormat;
