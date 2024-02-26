export const dateFormat= (date: Date) => {
  const formatter = new Intl.DateTimeFormat("ru", {
    hour: "numeric",
    minute: "numeric",
  });

  return formatter.format(date);

}
