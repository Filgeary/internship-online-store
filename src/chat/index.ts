import { TConfig } from '@src/config';
import Services from '@src/services';
import excludeArray from '@src/utils/exclude-array';

import { TAuthor, TListeners, TMessage, TResponse } from './types';

class ChatService {
  services: Services;
  config: TConfig['chat'];
  ws: WebSocket;
  messages: TMessage[];
  listeners: ((...args: any[]) => void)[];
  userId: string;
  token: string;
  lastDate: string;
  needUpdate: boolean = false;
  waiting: boolean = false;
  state: {
    messages: TMessage[];
    waiting: boolean;
  };

  constructor(services: Services, config = {}) {
    this.services = services;
    this.config = config as TConfig['chat'];

    this.messages = [];
    this.listeners = [];
    this.state = {
      messages: [],
      waiting: false,
    };
  }

  /**
   * Открыть соединение с сервером
   */
  auth(token: string, userId: string, reconnectCount: number = 0) {
    if (this.ws && this.ws.readyState === 1 && reconnectCount < 10) return;
    this.waiting = true;
    this.callAllListeners();

    this.ws = new WebSocket(this.config.url);
    this.userId = userId;
    this.token = token;

    this.ws.onopen = () => {
      this.ws.send(
        JSON.stringify({
          method: 'auth',
          payload: {
            token,
          },
        })
      );
    };

    this.ws.onmessage = (event) => {
      const method = JSON.parse(event.data).method;
      const methodCapitalize = method[0].toUpperCase() + method.slice(1);
      const methodName = ('on' + methodCapitalize) as TListeners;
      console.log('[WebSocket_chat] method:', methodCapitalize);

      this[methodName](event.data);
    };

    this.ws.onclose = (event) => {
      // Если подключение закрыто не успешно
      if (!event.wasClean) {
        this.auth(token, userId, reconnectCount + 1);
        setTimeout(() => {
          if (this.ws.readyState === 1) {
            this.requestLastMessages();
            this.needUpdate = true;
          }
        }, 1500);
      }
    };
  }

  /**
   * Отправить сообщение
   */
  sendMessage(message: string, author: TProfile | TAuthor) {
    const uuid = window.crypto.randomUUID();
    const bodyObj = {
      method: 'post',
      payload: {
        _key: uuid,
        text: message,
      },
    };
    const newMessage: TMessage = {
      _id: uuid,
      _key: uuid,
      text: message,
      author,
      dateCreate: new Date().toISOString(),
      sended: true,
    };
    this.messages = [...this.messages, newMessage];
    this.waiting = true;

    this.callAllListeners();

    this.ws.send(JSON.stringify(bodyObj));
  }

  /**
   * Запросить последние сообщения
   */
  requestLastMessages() {
    const bodyObj = {
      method: 'last',
      payload: {},
    };
    this.ws.send(JSON.stringify(bodyObj));
    this.waiting = true;
    this.callAllListeners();
  }

  /**
   * Запрос старых сообщений
   */
  requestOldMessages() {
    const firstMessage = this.messages[0];
    if (!firstMessage) return;

    const fromId = firstMessage._id;
    const bodyObj = JSON.stringify({
      method: 'old',
      payload: {
        fromId,
      },
    });
    this.ws.send(bodyObj);
  }

  /**
   * Действия при методе `auth`
   */
  onAuth() {
    this.requestLastMessages();
  }

  /**
   * Действия при методе `last`
   */
  onLast(responseRaw: string) {
    const jsonObj: TResponse<{ items: TMessage[] }> = JSON.parse(responseRaw);
    const messages = jsonObj.payload.items;
    if (!this.needUpdate) this.messages = messages;
    else {
      const res = excludeArray(this.messages, messages, (obj1: TMessage[], obj2: TMessage[]) => {
        const keys = Object.keys(obj1);

        for (const key of keys) {
          const val1 = obj1[key as keyof TMessage[]];
          const val2 = obj2[key as keyof TMessage[]];

          // Для null
          if (val1 === val2) continue;

          // Для вложенных объектов, их сравнивать вглубь не будем
          if (typeof val1 === 'object' && typeof val2 === 'object') continue;
          if (val1 !== val2) return false;
        }

        return true;
      });
      this.messages = [...this.messages, ...res];
    }

    this.needUpdate = false;
    this.waiting = false;
    this.lastDate = messages.at(-1).dateCreate;

    this.callAllListeners();
  }

  /**
   * Действия при методе `post`
   */
  onPost(responseRaw: string) {
    console.log('[WebSocket_chat] new message');
    const jsonObj: TResponse<TMessage> = JSON.parse(responseRaw);
    const message = jsonObj.payload;
    if (this.userId === message.author._id) {
      this.messages = this.messages.map((message) => {
        if (message.author._id === this.userId) {
          delete message.sended;
        }

        return message;
      });
    } else {
      this.messages = [...this.messages, message];
    }
    this.lastDate = message.dateCreate;

    this.waiting = false;
    this.callAllListeners();
  }

  /**
   * Запрос старых сообщений
   */
  onOld(responseRaw: string) {
    console.log('[WebSocket_chat] getting old messages');
    const jsonObj = JSON.parse(responseRaw);
    const messages = jsonObj.payload.items.slice(0, -1);

    this.messages = [...messages, ...this.messages];
    this.callAllListeners();
  }

  /**
   * Действия при очистке
   */
  onClear() {
    this.ws.send(
      JSON.stringify({
        method: 'clear',
        payload: {},
      })
    );
  }

  /**
   * Закрыть соединение
   */
  close() {
    this.ws.close();
  }

  /**
   * Для подписки
   */
  subscribe(listener: (...args: any[]) => any) {
    this.listeners = [...this.listeners, listener];
    return () => {
      this.listeners = this.listeners.filter((l) => l !== l);
    };
  }

  /**
   * Вызов всех функций-подписчиков
   */
  callAllListeners() {
    this.state = { messages: this.messages, waiting: this.waiting };
    this.listeners.forEach((fn) => fn());
  }

  /**
   * Для получения снапшота
   */
  getSnapshot() {
    return this.state;
  }
}

export default ChatService;
