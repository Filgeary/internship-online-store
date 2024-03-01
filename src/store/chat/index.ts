import { ReceivedMessage } from "@src/web-socket/types";
import Store from "..";
import StoreModule from "../module";
import { ModuleNames } from "../types";
import { ChatState, ChatConfig } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { Message } from "@src/types";
/**
 * Чат
 */
class ChatModule extends StoreModule<ChatState, ChatConfig> {
  removeClientFunction: Function | undefined

  constructor(...params: [Store, ModuleNames, ChatConfig]) {
    super(...params);
    this.removeClientFunction = undefined;
  }
  
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): ChatState {
    return {
      messages: []
    };
  }

  startListening() {
    if (this.removeClientFunction) return
    const unsubscribeLast = this.services.webSocket.events.last.subscribe((messages) => {
      this.setLastMessages(messages)
    })
    const unsubscribePost = this.services.webSocket.events.post.subscribe((message) => {
      this.setNewMessage(message)
    })
    const unsubscribeOld = this.services.webSocket.events.old.subscribe((oldMessages) => {
      this.setOldMessages(oldMessages)
    })
    const removeClient = this.services.webSocket.addClient({
      needSession: true,
      onSessionInit: () => {
        console.log('Запрашиваем последние 10 сообщений...')
        this.getLastMessages()
      },
      onSessionReconnect: () => {
        this.getLastMessages()
      }
    })
    this.removeClientFunction = () => {
      unsubscribeLast()
      unsubscribeOld()
      unsubscribePost()
      removeClient()
    }
  }

  stopListening(options?: {
    resetState?: boolean
  }) {
    if (this.removeClientFunction) {
      this.removeClientFunction()
      this.removeClientFunction = undefined
    }
    if (options?.resetState) {
      this.setState({
        ...this.initState()
      })
    }
  }

  setLastMessages(lastMessages: ReceivedMessage[]) {
    let messages = this.getState().messages
    const filteredLastMessages = lastMessages
      .filter((om) => !messages.find(m => m._id === om._id))
      .map((m) => ({...m, receivedFromServer: true})) as Message[]
    if (filteredLastMessages.length) {
      messages = [
        ...messages,
        ...filteredLastMessages
      ]
    }
    const unsended = messages.find(m => !m.receivedFromServer)
    if (unsended) {
      this.postMessage(unsended.text, unsended._key)
      messages = [
        ...messages.slice(0, messages.findIndex(m => m._id === unsended._id)),
        ...messages.slice(messages.findIndex(m => m._id === unsended._id) + 1),
      ]
    }
     this.setState({
      ...this.getState(),
      messages
    }, 'неотправленные сообщения отфильтрованы')


  }

  setNewMessage(message: ReceivedMessage) {
    let found = false
    let messages = this.getState().messages
      .map(m => {
        if (m._key === message._key) {
          found = true
          return {...message, receivedFromServer: true}
        } else return m
      })
    if (!found) messages.push({...message, receivedFromServer: true} as Message)
    const unsended = messages.find(m => !m.receivedFromServer)
    if (unsended) {
      this.postMessage(unsended.text, unsended._key)
      messages = [
        ...messages.slice(0, messages.findIndex(m => m._id === unsended._id)),
        ...messages.slice(messages.findIndex(m => m._id === unsended._id) + 1),
      ]
    }

    this.setState({
      ...this.getState(),
      messages: messages as Message[]
    }, 'новое сообщение')
  }

  setOldMessages(oldMessages: ReceivedMessage[]) {
    const messages = this.getState().messages
    if (messages?.[0]._id !== oldMessages[oldMessages.length - 1]._id) return
    const filteredOldMessages = oldMessages
      .filter((om: any) => !messages.find(m => m._id === om._id))
      .map((m: any) => ({...m, receivedFromServer: true})) as Message[]
    if (!filteredOldMessages.length) return
    this.setState({
      ...this.getState(),
      messages: [
        ...filteredOldMessages,
        ...messages,
      ]
    }, 'старые сообщения')
  }

  postMessage(text: string, existedKey?: string) {
    text = text.trim()
    if (!text) return
    let _key = existedKey || uuidv4()
    if (!existedKey) {
      this.setState({
        ...this.getState(),
        messages: [
          ...this.getState().messages,
          {
            text,
            _id: _key,
            _key,
            author: {
              _id: this.services.store.getState().session.user._id!,
              profile: this.services.store.getState().session.user.profile!,
              username: this.services.store.getState().session.user.profile!.name,
            },
            dateCreate: '',
          }
        ]
      }, 'новое сообщение на клиенте')
    }
    this.services.webSocket.events.post.emit(text, _key)
  }

  getOldMessages() {
    if (!this.getState().messages[0]) return
    this.services.webSocket.events.old.emit(this.getState().messages[0]._id)
  }

  getLastMessages() {
    const messages = this.getState().messages
    let fromDate
    if (messages.length) {
      fromDate = messages[messages.length - 1].dateCreate
    }

    this.services.webSocket.events.last.emit(fromDate)
  }

}

export default ChatModule;
