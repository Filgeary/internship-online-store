import { TConfig } from '@src/config';
import { TMessage } from '@src/containers/messages-wrapper/types';
import Services from '@src/services';

class ChatService {
  services: Services;
  config: TConfig['chat'];
  ws: WebSocket;
  url = 'ws://localhost:8010/chat';
  messages: TMessage[];

  constructor(services: Services, config = {}) {
    this.services = services;
    this.config = config as TConfig['chat'];
    this.ws = new WebSocket(this.url);

    this.ws.addEventListener('message', (event) => {
      const method = JSON.parse(event.data).method;
      const methodCapitalize = method[0].toUpperCase() + method.slice(1);
      console.log({ methodCapitalize });

      // @ts-ignore
      this['on' + methodCapitalize](event.data);
    });
  }

  /**
   * Открыть соединение с сервером
   */
  open(token: string) {
    this.ws.send(
      JSON.stringify({
        method: 'auth',
        payload: {
          token,
        },
      })
    );
  }

  /**
   * Отправить сообщение
   */
  sendMessage(message: string) {
    const bodyObj = {
      method: 'post',
      payload: {
        _key: window.crypto.randomUUID(),
        text: message,
      },
    };

    this.ws.send(JSON.stringify(bodyObj));
  }

  /**
   * Запросить последние сообщения
   */
  requestLastMessages() {
    const bodyObj = {
      method: 'last',
      payload: {
        fromDate: '2022-03-04T09:25:17.146Z',
      },
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
  onLast(messages: TMessage[]) {
    this.messages = messages;
  }

  /**
   * Действия при методе `post`
   */
  onPost(message: TMessage) {
    this.messages = [...this.messages, message];
  }
}

export default ChatService;
