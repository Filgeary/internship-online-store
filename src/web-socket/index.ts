import Services from "@src/services";
import { WebSocketConfig } from "./types"
import { v4 as uuidv4 } from 'uuid';

class WebSocketService {

  services: Services
  isListening: boolean
  connection: WebSocket | undefined
  config: WebSocketConfig
  lastMessagesListeners: Function[]
  authEventListeners: Function[]
  connectionMethodListeners: Function[]
  postMessageListeners: Function[]
  oldMessagesListeners: Function[]
  connectionListeners: {
    open: (e: Event) => void,
    message: (e: Event) => void,
    close: (e: Event) => void,
    error: (e: Event) => void,
  }

  

  constructor(services: Services, config: WebSocketConfig) {
    this.services = services;
    this.config = config
    this.isListening = false
    this.authEventListeners = []
    this.lastMessagesListeners = []
    this.connectionMethodListeners = []
    this.postMessageListeners = []
    this.oldMessagesListeners = []
  }

  startListening() {
    if (this.connection) return
    this.connection = new WebSocket(this.config.url)

    const onConnect = () => {
      if (!this.connection) return 
      this.connection.send(JSON.stringify({
        method: 'auth',
        payload: {
          token: this.services.store.getState().session.token
        }
      }))
    }

    const onClose = () => {
      this.restartListening()
    }
    const onError = () => {
      this.restartListening()
    }

    const onMessage = (e: any) => {
      const data = JSON.parse(e.data)
      if (data.method === 'auth') {
        if (data?.payload?.result) {
          this.onSuccessAuth()
        } else {
          this.onErrorAuth()
        }
      } else if (data.method === 'last') {
        this.onLastMessagesEvent(data.payload.items)
      } else if (data.method === 'post') {
        this.onPostMessage(data.payload)
      } else if (data.method === 'old') {
        this.onOldMessage(data.payload.items)
      }
    }

    this.connection.addEventListener('open', onConnect)
    this.connection.addEventListener('message', onMessage)
    this.connection.addEventListener('close', onClose)
    this.connection.addEventListener('error', onError)
    this.connectionListeners = {
      open: onConnect,
      message: onMessage,
      close: onClose,
      error: onError
    }
  }

  stopListening() {
    if (!this.connection) return
    this.connection.removeEventListener('open', this.connectionListeners?.open)
    this.connection.removeEventListener('message', this.connectionListeners?.message)
    this.connection.removeEventListener('close', this.connectionListeners?.close)
    this.connection.removeEventListener('error', this.connectionListeners?.error)
    this.connection.close()
    this.connection = undefined
  }

  subscribeOnLastMessagesEvent(listener: Function): () => void {
    this.lastMessagesListeners.push(listener)
    return () => {
      this.lastMessagesListeners = this.lastMessagesListeners.filter(item => item !== listener);
    }
  }

  subscribeOnAuthEvent(listener: Function): () => void {
    this.authEventListeners.push(listener)
    return () => {
      this.authEventListeners = this.authEventListeners.filter(item => item !== listener);
    }
  }

  restartListening() {
    this.stopListening()
    setTimeout(() => {
      console.log('trying restart')
      this.startListening()
    }, 1000)
  }

  sendLastEvent() {
    console.log('sended last')
    this.connection?.send(JSON.stringify({
      method: 'last',
      payload: {}
    }))
  }

  postMessage(text: string) {
    this.connection?.send(JSON.stringify({
      method: 'post',
      payload: {
        _key: uuidv4(),
        text
      }
  
    }))
  }

  onPostMessage(message: any) {
    for (const listener of this.postMessageListeners) listener(message);
  }

  subscribeOnPostMessageEvent(listener: Function): () => void {
    this.postMessageListeners.push(listener)
    return () => {
      this.postMessageListeners = this.postMessageListeners.filter(item => item !== listener);
    }
  }

  onLastMessagesEvent(messages: any) {
    console.log(messages)
    for (const listener of this.lastMessagesListeners) listener(messages);
  }

  onSuccessAuth() {
    console.log('Success auth')
    for (const listener of this.authEventListeners) listener();
  }
  

  onErrorAuth() {
    console.log('Auth ERROR!')
    this.restartListening()
  }



  getOldMessages(fromId: string) {
    this.connection?.send(JSON.stringify({
      method: 'old',
      payload: {
        fromId
      }
    }))
  }

  onOldMessage(messages: any) {
    for (const listener of this.oldMessagesListeners) listener(messages);
  }

  subscribeOnOldMessageEvent(listener: Function): () => void {
    this.oldMessagesListeners.push(listener)
    return () => {
      this.oldMessagesListeners = this.oldMessagesListeners.filter(item => item !== listener);
    }
  }

}

export default WebSocketService