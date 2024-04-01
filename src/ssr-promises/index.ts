class SsrPromisesService {
  ssrPromisesArr: Promise<unknown>[] = [];
  ssrRender: boolean = false;

  /**
   * Добавить промис в массив промисов
   */
  addPromise(promise: any) {
    this.ssrPromisesArr.push(promise);
  }


  clear(){
    this.ssrRender = true;
  }
  /**
   * Запустить все промисы из массива
  */
 async donePromises() {
   await Promise.all(this.ssrPromisesArr);
   this.ssrPromisesArr = [];
  }
}

export default SsrPromisesService;
