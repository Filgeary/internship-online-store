
export const longOperation = () => {
  const startTime = Date.now();
  while (Date.now() - startTime < 3000) {  }
}
