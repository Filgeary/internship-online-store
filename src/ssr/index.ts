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

  isPending(key: string) {
    return this.state.get(key)?.isPending;
  }

  getPromise(key: string) {
    return this.state.get(key);
  }

  setPromiseAndExecute(key: string, promise: Promise<unknown> | unknown) {
    logger.info('setPromiseAndExecute', key);

    this.state.set(key, {
      isPending: true,
      promise: promise,
    });
  }

  async executeAllPromises() {
    const promisesNeedToExecute = [];
    logger.info(' start executeAllPromises\n'.padStart(30, '>'));

    for (const [key, awaitedTask] of this.state.entries()) {
      if (awaitedTask.isPending && awaitedTask.promise instanceof Promise) {
        promisesNeedToExecute.push(awaitedTask.promise);
        this.setPendingStatusAsFalse(key);
      }
    }

    if (promisesNeedToExecute.length) {
      await Promise.all(promisesNeedToExecute)
        .then(() => {
          logger.success('All Promises done => only from Backend'.toUpperCase());
        })
        .catch(e => {
          logger.error(e);
        });
    }

    logger.info(' end executeAllPromises\n'.padStart(30, '<'));
  }

  deletePromise(key: string) {
    logger.info('deletePromise', key);
    this.state.delete(key);
  }

  setPendingStatusAsFalse(key: string) {
    if (this.state.has(key)) {
      const foundedPromise = this.state.get(key);
      if (foundedPromise) {
        this.state.set(key, { ...foundedPromise, isPending: false });
        setTimeout(() => {
          logger.info(
            'setPendingStatusAsFalse',
            key,
            `isPending: ${this.state.get(key)?.isPending}`,
          );
        }, 0);
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
