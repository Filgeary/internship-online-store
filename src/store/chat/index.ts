import StoreModule from "../module";
import { ConfigWS, InitialStateChat, MessageType, StatusType } from "./type";
import { v4 as uuidv4 } from "uuid";

class ChatState extends StoreModule<InitialStateChat, ConfigWS> {
  initState(): InitialStateChat {
    return {
      ws: null,
      messages: [],
      keyofMessageSentByMe: '',
      fromId: "",
    };
  }

  initConfig(): ConfigWS {
    return {} as ConfigWS;
  }

  connection(token: string) {
    this.getState().ws?.close();
    const ws = new WebSocket(this.config.url);
    this.setState({
      ...this.getState(),
      ws,
    });
    this.getState().ws?.addEventListener("open", () => this.auth(token));
    this.getState().ws?.addEventListener("message", (e) => this.onMessage(e));
    this.getState().ws?.addEventListener("error", (e) => {
      console.log(e);
    });
    this.getState().ws?.addEventListener("close", (e) => this.reconnect(e, token));
  }

  auth(token: string) {
    this.getState().ws?.send(
      JSON.stringify({
        method: "auth",
        payload: {
          token,
        },
      })
    );
  }

  //обработка всех отправок
  onMessage(e: MessageEvent) {
    const result = JSON.parse(e.data);
    switch(result.method) {
      case 'post': {
        this.onPostMessage(result.payload);
        break
      }
      case 'last': {
        this.onLastMessages(result.payload.items)
        break
      }
      case 'old': {
        this.onOldMessages(result.payload.items)
        break
      }
      case 'clear': {
        this.onClearMessages(result.payload)
        break
      }
    }
  }

  sendMessage(message: string) {
    const key = uuidv4();
    this.getState().ws?.send(
      JSON.stringify({
        method: "post",
        payload: {
          _key: key, // любым способом генерируем уникальный ключ
          text: message,
        },
      })
    );
    this.setState({
      ...this.getState(),
      keyofMessageSentByMe: key
    })
  }

  onPostMessage(message: MessageType) {
    const selfMessage = this.getState().keyofMessageSentByMe === message._key;
    if(selfMessage) {
      message['status'] = 'sent';
    }
    const messages = [...this.getState().messages, message];
    this.setState({
      ...this.getState(),
      messages,
    });
    console.log(this.getState().messages)
  }

  changeStatus(status: StatusType) {
    const messages = this.getState().messages.map(m => {
      m.status = status
      return m
    })

    this.setState({
      ...this.getState(),
      messages
    })
  }

  //получить последние сообщения, если не указать дату, придут последние 10 сообщений
  getLastMessages(fromDate?: string) {
    if (this.getState().ws?.readyState === 1) {
      this.getState().ws?.send(
        JSON.stringify({
          method: "last",
          payload: {
            fromDate,
          },
        })
      );
    } else {
      setTimeout(() => {
        this.getLastMessages(fromDate);
      }, 1000);
    }
  }

  onLastMessages(messages: MessageType[]) {
    this.setState({
      ...this.getState(),
      messages,
    });
  }

  //получение старых сообщений начиная с конкретного сообщения(id)
  getOldMessages() {
    const fromId = this.getState().messages[0]?._id;
    this.getState().ws?.send(
      JSON.stringify({
        method: "old",
        payload: {
          fromId,
        },
      })
    );
    this.setState({
      ...this.getState(),
      fromId
    })
  }

  onOldMessages(messages: MessageType[]) {
    const oldMessages = messages.slice(0, -1);

    this.setState({
      ...this.getState(),
      messages: [...oldMessages, ...this.getState().messages],
    });
  }

  reconnect(e: CloseEvent, token: string) {
    if(e.code === 1006) {
      this.connection(token)
      console.log(this.getState().ws, e)
    }
  }

  //очистить все сообщения
  clearAll() {
    this.getState().ws?.send(
      JSON.stringify({
        method: "clear",
        payload: {},
      })
    );
  }

  onClearMessages(result = {}) {
    if(!Object.keys(result).length) {
      this.setState({
        ...this.getState(),
        messages: []
      })
    }
  }

  close() {
    this.getState().ws?.close();
  }
}

export default ChatState;
