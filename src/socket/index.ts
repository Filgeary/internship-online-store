import type { IConfig } from "../config"
import Services from "../services"

class WebSocketService {
    services: Services
    config: IConfig["socket"]
    socket?: WebSocket
  
    constructor(services: Services, config: IConfig["socket"] = {} as IConfig["socket"]) {
      this.services = services;
      this.config = config;
    }
  
    /**
     * Установка WebSocket соединения
     * @param url Адрес WebSocket сервера
     * @param protocols Протоколы, поддерживаемые сервером
     */
    connect(url: string): void {
      const fullUrl = this.getWebSocketUrl(url);
      this.socket = new WebSocket(fullUrl);
    }
  
    /**
     * Отправка данных по WebSocket соединению
     * @param data Данные для отправки
     */
    send(method: string, payload: Record<string, string>): void {
        const data = JSON.stringify({
            method,
            payload: {
              ...payload
            }
          }); 

      if (this.socket) {
        this.socket.send(data);
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
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.close()
      }
    }
  
    /**
     * Получение полного URL для WebSocket соединения
     * @param url Адрес WebSocket сервера
     * @returns Полный URL
     */
    private getWebSocketUrl(url: string): string {
      if (!url.match(/^(ws|wss|\/\/)/)) {
        return (this.config.baseUrl || "ws://") + url;
      }
      return url;
    }
  }

  export default WebSocketService;