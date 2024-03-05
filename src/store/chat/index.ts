import StoreModule from "../module"
import { IChatState, IChat, TMessages } from "./types"
import generateUniqueId from "@src/utils/unicque_id"

/**
 * Список категорий
 */
class ChatState extends StoreModule<IChatState> {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): IChatState {
    return {
      messages: [],
      message: "",
      connected: false,
      statusClearChat: false
    }
  }

  /**
   * Установка соединения
   */
  onConnect() {
    this.services.socket.connect("example.front.ylab.io/chat")

    const socket = this.services.socket.socket!

    socket.onopen = () => {
      this.setState(
        {
          ...this.getState(),
          connected: true,
        },
        "Соединение установлено"
      )

      const token = localStorage.getItem("token") as string

      this.services.socket.send("auth", {
        token: token,
      })}

      socket.onmessage = (event: MessageEvent<any>) => {
        const messages = JSON.parse(event.data) as TMessages

        if (messages.method === "auth") {
          this.requestLatestMessages()
        }

        if (messages.method === "last") {
          if ("items" in messages.payload) {
            this.setState({
              ...this.getState(),
              messages: messages.payload.items,
              statusClearChat: false
            })
          }
        }

        if (messages.method === "post") {
          if (!("items" in messages.payload)) {
            this.setState({
              ...this.getState(),
              messages: [
                ...this.getState().messages,
                messages.payload,
              ],
              statusClearChat: false
            })
          }
        }

        if (messages.method === "old") {
          if ("items" in messages.payload) {
            this.setState({
              ...this.getState(),
              messages: messages.payload.items,
            })
          }
        }

        if (messages.method === "clear") {
          if (!("items" in messages.payload)) {
            this.setState({
              ...this.getState(),
              messages: [],
              statusClearChat: true
            })
          }
        }
      }
      
      socket.onclose = () => {
         if (this.getState().connected) this.onConnect()
        console.log("Socket закрыт")
      }

      socket.onerror = () => {
        console.log("Socket произошла ошибка")
      }
    }

  /**
   * Закрытие WebSocket соединения
   */
  close() {

    this.setState({
      ...this.getState(),
      connected: false,
    })

    this.services.socket.close()

  }

  /**
   * Отправка нового сообщения
   */
  newMessage() {
    if (this.services.socket.socket) {
      this.services.socket.send("post", {
        _key: generateUniqueId(),
        text: this.getState().message,
      })
    }
  }

  /**
   * Запрос свежих сообщений
   */
  requestLatestMessages() {
    if (this.services.socket.socket) {
      this.services.socket.send("last", {})
    }
  }

  /**
   * Запрос старых сообщений
   */
  requestOldMessage() {

    const id = this.getState().messages[0]._id

    if (this.services.socket.socket) {
      this.services.socket.send("old", {
        fromId: id,
      })
    }
  }

  /**
   * Удаление всех сообщений
   */
  deleteAllMessages() {
    if (this.services.socket.socket) {
      this.services.socket.send("clear", {})
    }
  }

  /**
   * Сохранение нового сообщения
   */
  setMessage(text: string) {
    this.setState({
      ...this.getState(),
      message: text,
    })
  }

  /**
   * Удаление нового сообщения
   */
  deleteMessage() {
    this.setState({
      ...this.getState(),
      message: "",
    })
  }

  // Генерируем искусственную ошибку в сокете
generateSocketError() {
  const event = new Event('error');
  this.services.socket.socket!.dispatchEvent(event);
}
}

export default ChatState
