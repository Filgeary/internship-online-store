import Services from "../services";
import { SocketsConfigType } from "../types/config";
import ChatWebSocket from "./chat";

class SocketFactoryService {
  private _services: Services;
  private _config: SocketsConfigType;
  private _token: string;

  constructor(services: Services, config: SocketsConfigType) {
    this._services = services;
    this._config = config
  }

  setToken(token: string) {
    this._token = token;
  }

  createWebSocket(name: "chat") {
    switch(name) {
      case "chat":
        return new ChatWebSocket(this._config.chat.url, this._token);

      default:
        throw new Error("Unknown socket type");
    }
  }
}

export default SocketFactoryService;
