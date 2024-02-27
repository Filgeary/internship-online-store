import StoreModule from "../module";
import { ConfigWS, InitialStateSeance } from "./type";
import { v4 as uuidv4 } from "uuid";

class SeanceState extends StoreModule<InitialStateSeance, ConfigWS> {
  initState(): InitialStateSeance {
    return {
      ws: null,
      connection: false,
      messages: [],
      timeId: ''
    };
  }

  initConfig(): ConfigWS {
    return {} as ConfigWS;
  }

  connection() {
    const ws = new WebSocket(this.config.url);
    this.setState({
      ...this.getState(),
      ws,
    });
  }

  auth(token: string) {
    this.connection();
    this.getState().ws?.addEventListener("open", (e) => {
      this.getState().ws?.send(
        JSON.stringify({
          method: "auth",
          payload: {
            token,
          },
        })
      );
    });
    this.onPong()
  }

  //Подписка на close
  onClose() {
    this.getState().ws?.addEventListener('close', () => {
      console.log('close')
    })
  }

  //убрать отключение сервером через минуту
  onPong() {
    const timeId = setInterval(() => {
      console.log(this.getState().ws?.readyState);
      this.getState().ws?.send(JSON.stringify({type: 'pong'}))
    }, 55000);
    this.setState({
      ...this.getState(),
      timeId
    })
  }

  //обработка всех отправок
  onMessage() {
    this.getState().ws?.addEventListener("message", (e) => {
      const result = JSON.parse(e.data).payload;
      if (this.getState().ws?.readyState) {
        this.setState({
          ...this.getState(),
          connection: true,
        });
      }
      if (result) {
        console.log(result)
        if(result.items) {
          const messages = [...result.items];
          this.setState({
            ...this.getState(),
            messages,
          });
        } else {
          const messages = [...this.getState().messages, result];
          this.setState({
            ...this.getState(),
            messages,
          });
        }
      }
    });
  }

  sendMessage(text: string) {
    this.getState().ws?.send(
      JSON.stringify({
        method: "post",
        payload: {
          _key: uuidv4(), // любым способом генерируем уникальный ключ
          text,
        },
      })
    );
  }

  //получить последние сообщения, если не указать дату, придут последние 10 сообщений
  getLastMessages(fromDate?: string) {
    this.getState().ws?.send(
      JSON.stringify({
        method: "last",
        payload: {
          fromDate,
        },
      })
    );
  }

  //получение старых сообщений начиная с конкретного сообщения(id)
  getOldMessages(fromId?: string) {
    this.getState().ws?.send(
      JSON.stringify({
        method: "old",
        payload: {
          fromId,
        },
      })
    );
  }
  //очистить все сообщения
  clearAll() {
    this.getState().ws?.send(
      JSON.stringify({
        method: "clear",
        payload: {},
      })
    );
  }

  close() {
    if(this.getState().timeId) clearInterval(this.getState().timeId);
    // this.getState().ws?.removeEventListener("close", this.connection);
    this.getState().ws?.close()
  }
}

export default SeanceState;
