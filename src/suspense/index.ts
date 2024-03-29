class SuspenseService {
  promisesArr: Promise<unknown>[] = [];

  /**
   * Добавить промис в массив промисов
   */
  appendPromise(promise: Promise<unknown>) {
    this.promisesArr.push(promise);
  }

  /**
   * Запустить все промисы из массива
   */
  async execAllPromises() {
    Promise.all(this.promisesArr);
    this.promisesArr = [];
  }
}

export default SuspenseService;
