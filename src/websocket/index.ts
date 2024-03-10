import Services from "@src/services";
import {Config} from "@src/config";

export interface WebSocketConnection {
  socket: WebSocket;
  messageHandler: ((message: any) => void) | null;
}

class WebSocketService {
  private connections: Map<string, WebSocket>;
  private services: Services;
  private config: Config['websocket'];

  constructor(services: Services, config: Config['websocket']) {
    this.connections = new Map();
    this.services = services;
    this.config = config;
  }

  async connect(connectionName: string, messageHandler: (message: any) => void, authentication: Record<string, any> = {}) {
    const url = this.config.baseUrl + connectionName;
    const currentSocket = this.connections.get(connectionName);

    if (currentSocket && currentSocket.readyState === WebSocket.OPEN) {
      return currentSocket;
    }

    const socket = new WebSocket(url);

    socket.onopen = (ev) => {
      this.connections.set(connectionName, socket);
      socket.send(JSON.stringify(authentication))
    };

    socket.onerror = (ev) => {
      console.error("Ошибка подключения WebSocket:", ev);
    };

    socket.onmessage = (ev) => {
      const message = JSON.parse(ev.data);
      console.log('Получено сообщение:', message);
      messageHandler(message);
    };

    socket.onclose = (ev) => {
      console.log('Закрытие соединения', ev);
      if (ev.code === 1006) {
        console.log('Переподключение...');
        this.connect(connectionName, messageHandler, authentication);
      }
    };

    return socket;
  }

  send(socketName: string, message: Record<string, any>, reconnectionAttempts = 1) {
    const socket = this.connections.get(socketName)
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log('Отправлено сообщение:', message);
      socket.send(JSON.stringify(message));
      return true;
    } else {
      console.error('Соединение закрыто или не установлено');
      if (reconnectionAttempts <= 5) {
        setTimeout(() => {
          this.send(socketName, message, reconnectionAttempts + 1)
        }, 1000)
      } else {
        console.error('Отправить сообщение не удалось')
        return false;
      }
    }
  }

  close(socketName: string, reconnectionAttempts = 1) {
    const socket = this.connections.get(socketName)
    if (socket) {
      socket.close(3001, 'Закрытие на клиенте');
      this.connections.delete(socket.url.slice(this.config.baseUrl.length));
      return true;
    } else {
      console.error(`Нет сокета по данному ключу: ${socketName}`)
      if (reconnectionAttempts <= 5) {
        setTimeout(() => {
          this.close(socketName, reconnectionAttempts + 1)
        }, 1000)
      } else {
          console.error('Отправить сообщение не удалось')
          return false;
      }
    }
  }
}

export default WebSocketService;
