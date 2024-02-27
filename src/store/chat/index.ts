import { ChatItemType, ServerResponceMulti, ServerResponcePost } from "../../types/chat";
import StoreModule from "../module";
import { ChatStateType } from "./type";

/**
 * Chat storage
 */
class ChatState extends StoreModule<ChatStateType> {
  waiting: boolean;
  list: ChatItemType[];
  lastMessage: string;
  lastOldRequest: string;
  lastLoading: boolean;

  /**
   * Начальное состояние
   */
  initState(): ChatStateType {
    return {
      list: [],
      waiting: false,
      lastMessage: '',
      lastOldRequest: '',
      lastLoading: false,
    };
  }

  /**
   * Загрузка списка сообщений
   */
  getMessages() {
    if(this.getState().list.length === 0) {
      this.services.chat.subscribe((e: ServerResponcePost | ServerResponceMulti) => this.onMessageRecieve(e))
      this.services.chat.initialRequest();
    }
  }

  sendMessage(message: ChatItemType) {
    this.services.chat.sendMessage({_key: message._key, text: message.text});
    this.setState({
      ...this.getState(),
      list: [...this.getState().list, message],
      lastMessage: message._key,
    }, "Запись отправленного сообщения")
  }

  requestOldMessages() {
    const lastId = this.getState().list[0]._id;
    this.services.chat.requestOldMessages(lastId);
    this.setState({
      ...this.getState(),
      lastOldRequest: lastId,
      lastLoading: true
    }, "Загрузка старых сообщений")
  }

  onMessageRecieve(e:ServerResponcePost | ServerResponceMulti) {
    switch(e.method) {
      case "post":
        const item =  this.getState().list.find(i => i._key === e.payload._key);
        if(item) {
          this.setState({
            ...this.getState(),
            list: this.getState().list.map(i => i._key === e.payload._key ? {...e.payload} : i)
          }, "Получено подтверждение нашего сообщение от сервера")
        } else {
          this.setState({
            ...this.getState(),
            list: [...this.getState().list, e.payload]
          }, "Получено сообщение с сервера")
        }
        break;
      case "last":
        this.setState({
          ...this.getState(),
          list: [...this.getState().list, ...e.payload.items]
        }, "Первичное получение списка сообщений")
        break;
      case "old":
        console.log("Старые")
        this.setState({
          ...this.getState(),
          list: [...e.payload.items.filter(i => i._id !== this.getState().lastOldRequest), ...this.getState().list],
          lastLoading: false,
          lastOldRequest: ''
        }, "Получены старые сообщения от сервера")
        break;
      default:
        break;
    }
  }
}

export default ChatState;
