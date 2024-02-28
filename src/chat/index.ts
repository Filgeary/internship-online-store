import { TConfig } from '@src/config';
import Services from '@src/services';
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

  constructor(services: Services, config = {}) {
    this.services = services;
    this.config = config as TConfig['chat'];

    this.messages = [];
    this.listeners = [];
  }

  /**
   * Открыть соединение с сервером
   */
  auth(token: string, userId: string, reconnectCount: number = 0) {
    console.log('Переподключась');
    console.log('Переподключаться заканчиваю:', reconnectCount < 10);
    if (this.ws && this.ws.readyState === 1 && reconnectCount < 10) return;

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
      console.log('Соединение закрыто успешно:', event.wasClean);
      if (!event.wasClean) this.auth(token, userId, reconnectCount + 1);
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
    this.messages = messages;
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
    this.listeners.forEach((fn) => fn());
  }

  /**
   * Для получения снапшота
   */
  getSnapshot() {
    return this.messages;
  }
}

export default ChatService;
