import StoreModule from "../module"
import { IChatState, IChat, TMessages } from "./types"
import generateUniqueId from "@src/utils/unicque_id"

/**
 * Список категорий
 */
class ChatState extends StoreModule<IChatState> {
  private timeoutId: ReturnType<typeof setTimeout> | null = null
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): IChatState {
    return {
      messages: [],
      message: "",
      connected: false,
      clearChat: false
    }
  }

  /**
   * Подключение и запрос данных
   */
  request() {
    this.onConnect()
    this.timeoutId = setTimeout(() => this.requestLatestMessages(), 1000)
  }

  /**
   * Установка соединения
   */
  private onConnect() {
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
      })

      socket.onmessage = (event: MessageEvent<any>) => {
        const messages = JSON.parse(event.data) as TMessages

        if (messages.method === "last") {
          if ("items" in messages.payload) {
            this.setState({
              ...this.getState(),
              messages: messages.payload.items,
              clearChat: false
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
              clearChat: false
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
          if ("items" in messages.payload) {
            this.setState({
              ...this.getState(),
              messages: [],
              clearChat: true
            })
          }
        }
      }
      }

      socket.onclose = () => {
        if (this.getState().connected) this.request()
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
    this.services.socket.close()

    this.setState({
      ...this.getState(),
      connected: false,
    })

    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId)
    }
  }

  /**
   * Отправка нового сообщения
   */
  newMessage() {
    if (this.getState().connected) {
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
    if (this.getState().connected) {
      this.services.socket.send("last", {})
    }
  }

  /**
   * Запрос старых сообщений
   */
  requestOldMessage() {

    const lastIndex = this.getState().messages.length - 1
    const id = this.getState().messages[0]._id

    if (this.getState().connected) {
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
}

export default ChatState
