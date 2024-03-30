class SsrPromisesService {
  ssrPromises: Promise<unknown>[] = [];
  ssrRender: boolean = true;

  /**
   * Добавить промис в массив промисов
   */
  addPromise(promise:any) {
    this.ssrPromises.push(promise);
  }

  /**
   * Запустить все промисы из массива
   */
  async donePromises() {
    await Promise.all(this.ssrPromises);
    this.ssrPromises = [];
  }
}

export default SsrPromisesService;
