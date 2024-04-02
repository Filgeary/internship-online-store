export class PromiseService {
  promises: Promise<any>[];
  names: string[];

  constructor(initals?: string[]) {
    this.promises = [];
    this.names = initals ? initals : [];
  }

  addPromise<T>(promise: Promise<T>, key: string) {
    this.names.push(key);
    this.promises.push(promise);
    console.log(promise)
  }

  isAdded(key: string) {
    return  !!this.names.find(i => i === key);
  }

  delete(key: string) {
    this.names = this.names.filter(i => i !== key);
  }

  async waitPromises() {
    return await Promise.allSettled(this.promises);
  }
}
