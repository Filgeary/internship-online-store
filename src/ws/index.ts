import type { TConfig } from "../config";
import Services from "../services";

class WSService {
  services: Services;
  config: TConfig["chat"];
  ws?: WebSocket;

  constructor(
    services: Services,
    config: TConfig["chat"] = {} as TConfig["chat"]
  ) {
    this.services = services;
    this.config = config;
  }

  /**
   * Установка WebSocket соединения
   * @param url Адрес WebSocket сервера
   * @param protocols Протоколы, поддерживаемые сервером
   */
  connect(url: string): void {
    if (!url.match(/^(ws|wss|\/\/)/)) url = this.config.baseUrl + url;
    this.ws = new WebSocket(url);
  }

  /**
   * Отправка данных по WebSocket соединению
   * @param data Данные для отправки
   */
  send(method: string, payload: Record<string, string>): void {
    const data = JSON.stringify({
      method,
      payload: {
        ...payload,
      },
    });

    if (this.ws) {
      this.ws.send(data);
    } else {
      console.error("WebSocket connection is not open.");
    }
  }

  /**
   * Закрытие WebSocket соединения
   * @param code Код закрытия
   * @param reason Причина закрытия
   */
  close(code?: number, reason?: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
  }
}

export default WSService;
