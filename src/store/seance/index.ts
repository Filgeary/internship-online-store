import StoreModule from "../module";
import { ConfigWS, InitialStateSeance } from "./type";
import { v4 as uuidv4 } from "uuid";

class SeanceState extends StoreModule<InitialStateSeance, ConfigWS> {
  initState(): InitialStateSeance {
    return {
      ws: null,
      connection: false,
      messages: [],
    };
  }

  initConfig(): ConfigWS {
    return {} as ConfigWS;
  }

  connection() {
    this.setState({
      ...this.getState(),
      ws: new WebSocket(this.config.url),
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
  }

  onMessage() {
    this.getState().ws?.addEventListener("message", (e) => {
      const connection = JSON.parse(e.data).payload.result;
      const result = JSON.parse(e.data).payload;
      console.log(connection, this.getState().ws?.readyState)
      if (this.getState().ws?.readyState) {
        this.setState({
          ...this.getState(),
          connection: true,
        });
      }
      if (result) {
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

  clearAll() {
    this.getState().ws?.send(
      JSON.stringify({
        method: "clear",
        payload: {},
      })
    );
  }

  close() {
    this.getState().ws?.close();
  }
}

export default SeanceState;
