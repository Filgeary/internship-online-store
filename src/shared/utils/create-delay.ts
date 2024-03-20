export function createDelay(delayInMilliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delayInMilliseconds);
  });
}
