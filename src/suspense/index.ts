type TUpgradedPromise = Promise<unknown> & { promiseId: string };

class SuspenseService {
  promisesArr: TUpgradedPromise[] = [];
  executedPromises: string[] = [];

  /**
   * Добавить промис в массив промисов
   */
  appendPromise(promise: TUpgradedPromise) {
    this.promisesArr.push(promise);
  }

  /**
   * Запустить все промисы из массива
   */
  async execAllPromises() {
    return Promise.all(this.promisesArr).then(() => {
      this.promisesArr.forEach((promise) => {
        this.executedPromises.push(promise.promiseId);
      });

      this.promisesArr = [];
    });
  }
}

export default SuspenseService;
