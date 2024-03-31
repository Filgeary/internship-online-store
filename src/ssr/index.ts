import type { TServices } from '@src/services';
import type { TConfig } from '@src/store';
import { logger } from '@src/utils/logger';

class SSRService {
  private state = new Map<string, { isPending: boolean; promise: Promise<unknown> | unknown }>();
  services: TServices;
  config: TConfig['ssr'];

  constructor(services: TServices, config: TConfig['ssr'] | object = {}) {
    this.services = services;
    this.config = config as TConfig['ssr'];
  }

  initWithStateDump(dump?: unknown) {
    if (dump) {
      this.state = new Map(Object.entries(dump));
    }
  }

  getStateOfPromisesAsDump() {
    const promisesState = {} as Record<string, boolean>;

    for (const [key, value] of this.state.entries()) {
      promisesState[key] = value.isPending;
    }

    return promisesState;
  }

  hasKey(key: string) {
    return this.state.has(key);
  }

  getPromise(key: string) {
    return this.state.get(key);
  }

  setPromiseAndExecute(key: string, promise: Promise<unknown> | unknown) {
    logger.info('setPromiseAndExecute', key, JSON.stringify(promise));

    this.state.set(key, {
      isPending: true,
      promise: promise,
    });
  }

  executeAllPromises() {
    for (const [key, value] of this.state.entries()) {
      if (value.isPending && value.promise instanceof Promise) {
        value.promise
          .then(() => {
            this.setPromiseAsComplete(key);
          })
          .catch(e => {
            logger.error(e);
          });
      }
    }
    logger.warn('executeAllPromises');
  }

  deletePromise(key: string) {
    logger.warn('deletePromise', key);
    this.state.delete(key);
  }

  setPromiseAsComplete(key: string) {
    if (this.state.has(key)) {
      const foundedPromise = this.state.get(key);
      if (foundedPromise) {
        this.state.set(key, { ...foundedPromise, isPending: false });
        logger.info('setPromiseAsComplete', key, JSON.stringify(foundedPromise.isPending));
      }
    }
  }

  deleteAllPromises() {
    this.state.clear();
  }

  clear() {
    this.deleteAllPromises();
  }
}

export default SSRService;
