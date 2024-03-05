import { KeysCopiedStores } from "@src/types/type";
import Store from "..";
import StoreModule from "../module";
import { ConfigWS, InitialStateChat, MessageType, StatusType } from "./type";
import { v4 as uuidv4 } from "uuid";
import { Profile } from "../profile/type";

class ChatState extends StoreModule<InitialStateChat, ConfigWS> {
  ws: null | WebSocket;

  constructor(
    store: Store,
    name: KeysCopiedStores,
    config: {} | ConfigWS | undefined
  ) {
    super(store, name, config);
    this.ws = null;
  }

  initState(): InitialStateChat {
    return {
      messages: [],
      fromId: "",
      timeId: '',
      connection: false,
    };
  }

  initConfig(): ConfigWS {
    return {} as ConfigWS;
  }

  createChannel(token: string) {
    this.ws = new WebSocket(this.config.url);
    this.ws.onopen = () => this.auth(token);
    this.ws.onmessage = (e) => this.onMessage(e);
    this.ws.onclose = (e) => this.reconnect(e, token);
    this.ws.onerror = (e) => {
      if (navigator.onLine) this.initConnection(token)
    };
  }

  initConnection(token: string) {
    this.onClose();
    this.createChannel(token);
  }

  auth(token: string) {
    this.ws?.send(
      JSON.stringify({
        method: "auth",
        payload: {
          token,
        },
      })
    );
  }

  onAuth(connection: boolean) {
    new Promise((resolve) => {
      this.setState({
      ...this.getState(),
      connection,
    });
    resolve(connection);
  }).then(res => {
    if(res) {
      this.getLastMessages();
    }
    this.onPong();
  })
  }

  //обработка всех отправок
  onMessage(e: MessageEvent) {
    const result = JSON.parse(e.data);
    switch (result.method) {
      case "auth": {
        this.onAuth(result.payload.result);
        break;
      }
      case "post": {
        this.onPostMessage(result.payload);
        break;
      }
      case "last": {
        this.onLastMessages(result.payload.items);
        break;
      }
      case "old": {
        this.onOldMessages(result.payload.items);
        break;
      }
      case "clear": {
        this.onClearMessages(result.payload);
        break;
      }
    }
  }

  sendMessage(message: string, user: Partial<Profile>) {
    const key = uuidv4();
    this.ws?.send(
      JSON.stringify({
        method: "post",
        payload: {
          _key: key, // любым способом генерируем уникальный ключ
          text: message,
        },
      })
    );

    const newMessage = {
      _id: "",
      _key: key,
      text: message,
      author: {
        _id: user._id,
        username: user.username,
      },
      dateCreate: new Date().toISOString(),
      status: "pending" as StatusType,
    };

    this.setState(
      {
        ...this.getState(),
        messages: [...this.getState().messages, newMessage],
      },
      "Установлен ключ сообщения"
    );
  }

  onPostMessage(message: MessageType) {
    const selfMessage = this.getState().messages.find(m => m._key === message._key);
    if (selfMessage) {
      message['status'] = 'sent';
      const messages = this.getState().messages.map((m) => m._key === message._key ? message : m)
      this.setState(
        {
          ...this.getState(),
          messages
        },
        "Сообщение принято"
      );
    } else {
      this.setState(
        {
          ...this.getState(),
          messages: [...this.getState().messages, message],
        },
        "Сообщение принято"
      );
    }
  }

  changeStatus(status: StatusType) {
    const messages = this.getState().messages.map((m) => {
      m.status = status;
      return m;
    });

    this.setState(
      {
        ...this.getState(),
        messages,
      },
      "Сообщение прочитано"
    );
  }

  //получить последние сообщения, если не указать дату, придут последние 10 сообщений
  getLastMessages(fromDate?: string) {
    this.ws?.send(
      JSON.stringify({
        method: "last",
        payload: {
          fromDate,
        },
      })
    );
  }

  onLastMessages(messages: MessageType[]) {
    this.setState(
      {
        ...this.getState(),
        messages,
      },
      "Последние сообщения получены"
    );
  }

  //получение старых сообщений начиная с конкретного сообщения(id)
  getOldMessages() {
    if (!this.getState().messages.length) return;
    const fromId = this.getState().messages[0]?._id;
    this.ws?.send(
      JSON.stringify({
        method: "old",
        payload: {
          fromId,
        },
      })
    );
    this.setState({
      ...this.getState(),
      fromId,
    });
  }

  onOldMessages(messages: MessageType[]) {
    const oldMessages = messages.slice(0, -1);

    this.setState(
      {
        ...this.getState(),
        messages: [...oldMessages, ...this.getState().messages],
      },
      "Старые сообщения получены"
    );
  }

  reconnect(e: CloseEvent, token: string) {
    if (!e.wasClean && navigator.onLine) {
      this.initConnection(token);
    }
  }

  //очистить все сообщения
  clearAllMessages() {
    this.ws?.send(
      JSON.stringify({
        method: "clear",
        payload: {},
      })
    );
  }

  onClearMessages(result = {}) {
    if (!Object.keys(result).length) {
      this.setState(
        {
          ...this.getState(),
          messages: [],
        },
        "Все сообщения удалены"
      );
    }
  }

  onClose() {
    if(!this.ws) return;
    this.onAuth(false);
    clearInterval(this.getState().timeId);
    this.ws?.close();
    this.ws = null;
  }

  onPong() {
    const timeId = setInterval(() => this.ws?.send(JSON.stringify({ type: "pong" })), 55000);
    this.setState({
      ...this.getState(),
      timeId
    })
  }
}

export default ChatState;
