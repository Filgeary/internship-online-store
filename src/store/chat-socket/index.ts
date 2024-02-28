import StoreModule from "../module";
import { TChatState, TConfigWS } from "./type";
import { v4 as uuidv4 } from "uuid";

class ChatState extends StoreModule<TChatState, TConfigWS> {
  initState(): TChatState {
    return {
      ws: null,
      connection: false,
      messages: [],
      timeId: "",
      waiting: false,
      fromId: "",
    };
  }

  connection() {
    const ws = new WebSocket(this.config.baseUrl);
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
    this.onPong();
  }

  onClose() {
    this.getState().ws?.addEventListener("close", () => {
      console.log("close");
    });
  }

  onPong() {
    const timeId = setInterval(() => {
      console.log(this.getState().ws?.readyState);
      this.getState().ws?.send(JSON.stringify({ type: "pong" }));
    }, 55000);
    this.setState({
      ...this.getState(),
      timeId,
    });
  }

  //обработка всех сообщений
  onMessage() {
    this.getState().ws?.addEventListener("message", (e) => {
      const result = JSON.parse(e.data).payload;

      if (this.getState().ws?.readyState) {
        this.setState({
          ...this.getState(),
          connection: true,
          waiting: true,
        });
      }
      if (result) {
        if (result.items) {
          let fromId = result.items[0]._id;
          let items;
          if (this.getState().messages.length > 0) {
            let one = this.getState().messages.shift()!;
            items = this.getState().messages.filter((el) => el._id !== one._id);
          }

          const messages = [
            ...result.items,
            ...(items ? items : this.getState().messages),
          ];

          this.setState({
            ...this.getState(),
            fromId,
            messages,
            waiting: false,
          });
        } else {
          const messages = [...this.getState().messages, result];
          this.setState({
            ...this.getState(),
            messages,
            waiting: false,
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
          _key: uuidv4(),
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

  getOldMessages() {
    const fromId = this.getState().fromId;
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
    if (this.getState().timeId) clearInterval(this.getState().timeId);
    this.getState().ws?.close();
  }
}

export default ChatState;
