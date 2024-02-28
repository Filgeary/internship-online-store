import StoreModule from "../module";
import { ChatState, ChatConfig } from "./types";
/**
 * Чат
 */
class ChatModule extends StoreModule<ChatState, ChatConfig> {
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
    this.services.webSocket.startListening()
    this.services.webSocket.subscribeOnAuthEvent(() => {
      this.services.webSocket.sendLastEvent()
    })
    this.services.webSocket.subscribeOnLastMessagesEvent((messages: any) => {
      this.setLastMessages(messages)
    })
    this.services.webSocket.subscribeOnPostMessageEvent((message: any) => {
      this.setNewMessage(message)
    })

    this.services.webSocket.subscribeOnOldMessageEvent((oldMessages: any) => {
      this.setOldMessages(oldMessages)

    })
  }

  setLastMessages(messages: any) {
    this.setState({
      ...this.getState(),
      messages: [
        ...this.getState().messages,
        ...messages
      ]
    })
  }

  setNewMessage(message: any) {
    this.setState({
      ...this.getState(),
      messages: [
        ...this.getState().messages,
        message
      ]
    })
  }

  setOldMessages(oldMessages: any) {
    this.setState({
      ...this.getState(),
      messages: [
        ...oldMessages,
        ...this.getState().messages,
      ]
    })
  }

  postMessage(text: string) {
    this.services.webSocket.postMessage(text)
  }

  getOldMessages() {
    this.services.webSocket.getOldMessages(this.getState().messages[0]._id)
  }

}

export default ChatModule;
