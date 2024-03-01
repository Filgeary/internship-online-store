import Services from "@src/services";
import EventModule from "../module";
import { ReceivedMessage } from "../types";


type RecievedPayload = {
  items: ReceivedMessage[]
}

class Old extends EventModule {
  listeners: ((messages: ReceivedMessage[]) => void)[]

  constructor(...args: [Services, 'old']) {
    super(...args)
    this.listeners = []
  }

  emit(fromId: string) {
    this.emitAuthorizedEvent({
      fromId
    })
  }

  handleEvent(payload: RecievedPayload | undefined) {
    if (payload?.items) {
      for (const listener of this.listeners) listener(payload.items);
    }
  }

  subscribe(listener: (messages: ReceivedMessage[]) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    }
  }
}

export default Old