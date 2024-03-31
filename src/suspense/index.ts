import { TUpgradedPromise } from './types';

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
    return await Promise.all(this.promisesArr).then(() => {
      this.promisesArr.forEach((promise) => {
        this.executedPromises.push(promise.promiseId);
      });
      this.promisesArr = [];
    });
  }
}

export default SuspenseService;
