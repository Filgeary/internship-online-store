import { TConfig } from '@src/config';
import Services from '@src/services';
import { TAuthor, TMessage } from './types';

class ChatService {
  services: Services;
  config: TConfig['chat'];
  ws: WebSocket;
  messages: TMessage[];
  listeners: ((...args: any[]) => void)[];
  userId: string;

  constructor(services: Services, config = {}) {
    this.services = services;
    this.config = config as TConfig['chat'];

    this.messages = [];
    this.listeners = [];
  }

  /**
   * Открыть соединение с сервером
   */
  auth(token: string, userId: string) {
    this.ws = new WebSocket(this.config.url);
    this.userId = userId;

    this.ws.addEventListener('open', () => {
      this.ws.send(
        JSON.stringify({
          method: 'auth',
          payload: {
            token,
          },
        })
      );
    });

    this.ws.addEventListener('message', (event) => {
      const method = JSON.parse(event.data).method;
      const methodCapitalize = method[0].toUpperCase() + method.slice(1);
      console.log('[WebSocket_chat] method:', methodCapitalize);

      // @ts-ignore
      this['on' + methodCapitalize](event.data);
    });
  }

  /**
   * Отправить сообщение
   */
  sendMessage(message: string, author: TAuthor) {
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
   * Действия при методе `auth`
   */
  onAuth() {
    this.requestLastMessages();
  }

  /**
   * Действия при методе `last`
   */
  onLast(messagesRaw: string) {
    const jsonObj = JSON.parse(messagesRaw);
    const messages = jsonObj.payload.items;
    this.messages = messages;

    this.callAllListeners();
  }

  /**
   * Действия при методе `post`
   */
  onPost(messageRaw: string) {
    console.log('[WebSocket_chat] new message');
    const jsonObj = JSON.parse(messageRaw);
    const message = jsonObj.payload;
    if (this.userId === jsonObj.payload.author._id) {
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
