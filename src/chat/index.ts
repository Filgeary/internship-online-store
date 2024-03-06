import Services from "@src/services";
import { ChatConfig, IBaseResponse, IConnectProps, TMessageMethods } from "./types";
import { v4 as uuidv4 } from "uuid";

class ChatService {
  services: Services;
  config: ChatConfig;
  uuid: string;
  isOpen: boolean;
  private socket: WebSocket | undefined;
  methods: TMessageMethods; 

  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(services: Services, config: ChatConfig) {
    this.services = services;
    this.config = config;
    this.uuid = uuidv4();
    this.isOpen = false;
    this.methods = {};
  }

  connect({token, ...methods}: IConnectProps) {
    this.close();
    this.methods = methods;
    this.uuid = uuidv4();
    this.socket = new WebSocket(this.config.baseUrl);
    this.socket.addEventListener("close", (event: CloseEvent) => {
      console.log(event);
      this.isOpen = false;
    });
    this.socket.addEventListener("open", () => {
      if (!this.socket) return;
      this.isOpen = true;

      this.socket.send(
        JSON.stringify({
          method: "auth",
          payload: {
            token,
          },
        })
      );
    });
    this.socket.addEventListener("message", (event: MessageEvent<any>) => {
      const data = JSON.parse(event.data) as IBaseResponse;
      if (data.method == "auth") {
        if (!this.socket) return;
        this.socket.send(
          JSON.stringify({
            method: "last",
            payload: {
            },
          })
        );
      }
      this.onMessage(data);
    });
  }

  onMessage(eventData: IBaseResponse) {
    switch (eventData.method) {
        case "auth":
            this.methods.onAuthMessage && this.methods.onAuthMessage(eventData.payload);
            break;
        case "last":
            this.methods.onLastMessages && this.methods.onLastMessages(eventData.payload);
            break;
        case "post":
            this.methods.onTextMessage && this.methods.onTextMessage(eventData.payload);
            break;
        default:
            break;
    }
  }

  sendMessage(text: string) {
    if (!this.socket || !this.isOpen) {
      console.log(this.isOpen);
      console.log("Error connection none");
      return;
    }
    this.socket.send(
      JSON.stringify({
        method: "post",
        payload: {
          _key: this.uuid, // любым способом генерируем уникальный ключ
          text,
        },
      })
    );
  }

  close() {
    if (this.socket !== undefined) {
      this.socket.close();
    }
  }
}

export default ChatService;
