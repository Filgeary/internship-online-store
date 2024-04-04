class SsrService {
  ssrPromisesArr: Promise<unknown>[] = [];
  ssrRender: boolean = true;

  addPromise(promise: any) {
    if (promise) {
      this.ssrPromisesArr.push(promise);
    }
  }

  clear() {
    this.ssrRender = false;
  }

  async donePromises() {
    await Promise.all(this.ssrPromisesArr);
    this.ssrPromisesArr = [];
  }
}

export default SsrService;
