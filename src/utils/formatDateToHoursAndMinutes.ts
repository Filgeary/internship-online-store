export function formatDateToHoursAndMinutes<T extends { dateCreate: Date }>(message: T) {
  return new Date(message.dateCreate).toLocaleString(undefined, {
    hour: 'numeric',
    minute: 'numeric',
  });
}
