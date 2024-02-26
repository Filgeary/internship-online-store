import {v4 as uuidv4} from 'uuid';
import Services from "@src/services";
import { ConfigWS, MessageType } from "./type";

class WSService {
  services: Services;
  config: ConfigWS;
  message: MessageType | [];
  listeners: ((messages: MessageType[]) => void)[];
  socket?: WebSocket;

  constructor(services: Services, config: ConfigWS = {} as ConfigWS) {
    this.services = services;
    this.config = config;

    this.message = [];
    this.listeners = [];
  }

  /**
   * Создание канала
   */
  createChannel() {
    this.socket?.removeEventListener('close', this.createChannel);
    this.socket?.close();
    this.socket = new WebSocket(this.config.baseUrl);
    this.socket.addEventListener("close", this.createChannel);
  }
  /**
   * Аутентификация
   */
  auth(token: string) {
    this.createChannel();
    this.socket?.addEventListener('open', () => {
      this.socket?.send(
        JSON.stringify({
          method: "auth",
          payload: {
            token,
          },
        })
      )
    })
  }

  /**
   * Новое сообщение
   */
  sendMessage(text: string) {
    this.socket?.addEventListener('message', () => this.socket?.send(
      JSON.stringify({
        method: "post",
        payload: {
          _key: uuidv4(), // любым способом генерируем уникальный ключ
          text,
        },
      })
    ))
  }

  /**
   * Запрос свежих сообщений (используется при коннекте)
   */
  requestLastMessages(fromDate?: string) {
    this.socket?.send(
      JSON.stringify({
        method: "last",
        payload: {
          fromDate,
        },
      })
    );
  }

  /**
   * Запрос старых сообщений
   */
  requestOldMessages(fromId: string) {
    this.socket?.send(
      JSON.stringify({
        method: "old",
        payload: {
          fromId,
        },
      })
    );
  }

  /**
   * удалить ВСЕ сообщения
   */
  removeAllMessages() {
    this.socket?.send(
      JSON.stringify({
        method: "clear",
        payload: {},
      })
    );
  }

  /**
   * Закрыть соединение
   */
  close() {
    this.socket?.addEventListener('close', (event) => {
      this.socket?.close();
    });
  }

  /**
   * Подписка слушателя
   */
  subscribe(listener: (messages: MessageType[]) => void): () => void {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  }
}

export default WSService;
