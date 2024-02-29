import Services from "@src/services";
import EventModule from "../module";
import { ModuleNames } from "../types";

type RecievedPayload = {
  items: any[]
}

class Last extends EventModule {
  listeners: ((messages: any) => void)[]

  constructor(...args: [Services, 'last']) {
    super(...args)
    this.listeners = []
  }

  emit(fromDate?: string) {
    this.emitAuthorizedEvent({
      fromDate
    })
  }

  handleEvent(payload: RecievedPayload | undefined) {
    if (payload?.items) {
      for (const listener of this.listeners) listener(payload.items);
    }
  }

  subscribe(listener: (messages: any) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    }
  }
}

export default Last