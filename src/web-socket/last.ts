class Last {

  lastMessagesListeners: Function[]

  constructor() {
    this.lastMessagesListeners = []
  }

  subscribeOnLastMessagesEvent(listener: Function): () => void {
    this.lastMessagesListeners.push(listener)
    return () => {
      this.lastMessagesListeners = this.lastMessagesListeners.filter(item => item !== listener);
    }
  }

  sendLastEvent() {
    console.log('sended last')
    this.connection?.send(JSON.stringify({
      method: 'last',
      payload: {}
    }))
  }

  onLastMessagesEvent(messages: any) {
    console.log(messages)
    for (const listener of this.lastMessagesListeners) listener(messages);
  }
}