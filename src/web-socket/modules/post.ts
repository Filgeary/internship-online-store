
import EventModule from "../module";
import Services from '@src/services';

class Post extends EventModule {

  listeners: ((message: any) => void)[]

  constructor(...args: [Services, 'last']) {
    super(...args)
    this.listeners = []
  }

  emit(text: string, _key: string) {
    this.emitAuthorizedEvent({
      _key,
      text
    })
  }

  handleEvent(payload: any) {
    for (const listener of this.listeners) listener(payload);
  }

  subscribe(listener: (message: any) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    }
  }
}

export default Post