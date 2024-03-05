import ChatWebSocket from "../../socket/chat";
import {
  ChatItemType,
  ServerResponceMulti,
  ServerResponcePost,
} from "../../types/chat";
import StoreModule from "../module";
import { ChatStateType } from "./type";

/**
 * Chat storage
 */
class ChatState extends StoreModule<ChatStateType> {
  private _socket: ChatWebSocket;
  private lastMessages: ChatItemType[] = [];
  waiting: boolean;
  list: ChatItemType[];
  lastOldRequest: string;
  lastLoading: boolean;

  /**
   * Начальное состояние
   */
  initState(): ChatStateType {
    return {
      list: [],
      waiting: false,
      lastOldRequest: "",
      lastLoading: false,
    };
  }

  /**
   * Загрузка списка сообщений
   */
  getMessages() {
    this._socket = this.services.socketsFactory.createWebSocket("chat");
    if (this.getState().list.length === 0) {
      this._socket.openConnection(
        (e: ServerResponcePost | ServerResponceMulti) =>
          this.onMessageRecieve(e)
      );
    } else {
      this._socket.restoreConnection(
        (e: ServerResponcePost | ServerResponceMulti) =>
          this.onMessageRecieve(e),
        this.getState().list[this.getState().list.length - 1].dateCreate
      );
    }

    setInterval(() => this.sendingMessages(), 10000);
  }

  /**
   * Закрытие соединения
   */
  closeConnection() {
    this._socket.closeConnection();
  }

  sendMessage(message: ChatItemType) {
    this.lastMessages.push(message);
    this._socket.sendMessage({ _key: message._key, text: message.text});
    this.setState(
      {
        ...this.getState(),
        list: [...this.getState().list, message],
      },
      "Запись отправленного сообщения"
    );
  }

  private sendingMessages() {
    const copy = this.lastMessages.slice();
    if(copy.length > 0) {
      for(const message of copy) {
        this._socket.sendMessage({ _key: message._key, text: message.text});
      }
    }
  }

  requestOldMessages() {
    const lastId = this.getState().list[0]._id;
    this._socket.requestOldMessages(lastId);
    this.setState(
      {
        ...this.getState(),
        lastOldRequest: lastId,
        lastLoading: true,
      },
      "Загрузка старых сообщений"
    );
  }

  onMessageRecieve(e: ServerResponcePost | ServerResponceMulti) {
    switch (e.method) {
      case "post":
        this.onPostRecieve(e);
        break;
      case "last":
        this.onLastRecieve(e);
        break;
      case "old":
        this.onOldRecieve(e);
        break;
      default:
        break;
    }
  }

  // Получение поста
  private onPostRecieve(e: ServerResponcePost) {
    const item = this.getState().list.find((i) => i._key === e.payload._key);
    if (item) {
      this.setState(
        {
          ...this.getState(),
          list: this.getState().list.map((i) =>
            i._key === e.payload._key ? { ...e.payload } : i
          ),
        },
        "Получено подтверждение нашего сообщение от сервера"
      );
      this.lastMessages = this.lastMessages.filter(m => m._key !== item._key);
    } else {
      this.setState(
        {
          ...this.getState(),
          list: [...this.getState().list, e.payload],
        },
        "Получено сообщение с сервера"
      );
    }
  }

  // Получение списка последних сообщений
  private onLastRecieve(e: ServerResponceMulti) {
    const lastId = this.getState().list[this.getState().list.length - 1];
    console.log(lastId)
    this.setState(
      {
        ...this.getState(),
        list: [...this.getState().list, ...e.payload.items.filter(i => i._id !== lastId?._id)],
      },
      "Первичное получение списка сообщений"
    );
  }

  // Получение старых сообщений
  private onOldRecieve(e: ServerResponceMulti) {
    this.setState(
      {
        ...this.getState(),
        list: [
          ...e.payload.items.filter(
            (i) => i._id !== this.getState().lastOldRequest
          ),
          ...this.getState().list,
        ],
        lastLoading: false,
        lastOldRequest: "",
      },
      "Получены старые сообщения от сервера"
    );
  }
}

export default ChatState;
