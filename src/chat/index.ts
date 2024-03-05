import { TConfig } from '@src/config';
import Services from '@src/services';

import excludeExistingMessages from './utils/exclude-existing-messages';

import { TAuthor, TListeners, TMessage, TResponse } from './types';

class ChatService {
  services: Services;
  config: TConfig['chat'];
  ws: WebSocket;
  messages: TMessage[];
  listeners: ((...args: any[]) => void)[];
  userId: string;
  token: string;
  lastId: string;
  needUpdate: boolean = false;
  waiting: boolean = false;
  connected: boolean = false;
  state: {
    messages: TMessage[];
    waiting: boolean;
    connected: boolean;
  };

  constructor(services: Services, config = {}) {
    this.services = services;
    this.config = config as TConfig['chat'];

    this.messages = [];
    this.listeners = [];
    this.state = {
      messages: [],
      waiting: false,
      connected: false,
    };
  }

  /**
   * Открыть соединение с сервером
   */
  auth(token: string, userId: string, reconnectCount: number = 0) {
    if (this.ws && this.ws.readyState === 1 && reconnectCount < 10) return;
    this.waiting = true;

    this.ws = new WebSocket(this.config.url);
    this.connected = true;
    this.userId = userId;
    this.token = token;

    this.callAllListeners();
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
      this.connected = false;
      this.callAllListeners();

      // Если подключение закрыто не успешно
      if (!event.wasClean) {
        this.auth(token, userId, reconnectCount + 1);
        this.needUpdate = true;
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
    this.requestMessagesSinceId(fromId);
  }

  /**
   * Запрос сообщений с определённого id
   */
  requestMessagesSinceId(fromId: string) {
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
      const res = excludeExistingMessages(this.messages, messages);
      this.messages = [...this.messages, ...res];
    }

    const lastMessageInResponse = messages.find((message) => message._id === this.lastId);
    if (!lastMessageInResponse) this.requestMessagesSinceId(messages[0]._id);

    this.needUpdate = false;
    this.waiting = false;
    this.lastId = messages.at(-1)._id;

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
    this.lastId = message._id;

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

    const res = excludeExistingMessages(this.messages, messages);

    this.messages = [...res, ...this.messages];
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
    this.state = { messages: this.messages, waiting: this.waiting, connected: this.connected };
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
