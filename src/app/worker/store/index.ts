import StoreModule from '@src/store/module';
// eslint-disable-next-line import/default
import WorkerGithub from '../workers/worker-chat-bot?worker';

import type { IMessage } from '@src/hooks/use-chat';
import type { PartialDeep } from 'type-fest';

type InitialWorkerState = {
  worker: Worker | null;
  message: PartialDeep<IMessage>;
};

class WorkerState extends StoreModule<InitialWorkerState> {
  initState(): InitialWorkerState {
    return {
      worker: null,
      message: {} as PartialDeep<IMessage>,
    };
  }

  private setMessage(message: PartialDeep<IMessage>) {
    this.setState({ ...this.getState(), message }, 'Message received');
  }

  async init() {
    try {
      const worker = this.createWorker();
      if (worker) {
        worker.onmessage = ({ data }) => {
          this.setMessage(data);
        };
        this.setState({ ...this.getState(), worker }, 'Worker initialized');
      } else {
        throw new Error('Worker not found');
      }
    } catch (error) {
      console.error(error);
    }
  }

  createWorker() {
    return new WorkerGithub();
  }

  postMessage(data: any) {
    const worker = this.getState().worker;
    if (worker) {
      worker.postMessage(data);
    }
  }

  destroy() {
    const worker = this.getState().worker;
    if (worker) {
      worker.terminate();
      this.setState({ ...this.getState(), worker: null, message: {} }, 'Worker destroyed');
    }
  }
}

export default WorkerState;
