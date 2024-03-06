import { v4 as uuidv4 } from "uuid";
import StoreModule from "../module";

class ChatState extends StoreModule<IChatInitState, IChatConfig> {
  private socket: WebSocket | undefined;
  userId: string = "";

  initState(): IChatInitState {
    return {
      list: [],
      connection: false,
      waiting: false,
    };
  }

  initConfig(): IChatConfig {
    return {
      baseUrl: "",
    };
  }

  connect(token: string, userId: string) {
    console.log("Открылся")
    this.userId = userId;
    this.socket = new WebSocket(this.config.baseUrl!);
    this.socket.onopen = () => this.onOpen(token);
    this.socket.onclose = (event: CloseEvent) => this.onClose(event, token);
    this.socket.onmessage = (event: MessageEvent<string>) =>
      this.onMessage(event);
  }

  close() {
    this.socket?.close();
    this.setState({...this.initState()});
  }

  onClose(event: CloseEvent, token: string) {
    if (!event.wasClean) {
      console.log("Не Успешно закрылся")
      this.setState({
        ...this.getState(),
        connection: false
      })
      this.connect(token, this.userId);
    } else {
      console.log("Успешно закрылся")
    }
  }

  onMessage(event: MessageEvent<string>) {
    if (!this.socket) return;
    const data = JSON.parse(event.data) as IBaseResponse;
    switch (data.method) {
      case "auth":
        let lastIndex: number = -1;
        const list = this.getState().list;
        for (let index in list) {
          const status = list[list.length - 1 - +index].status;
          if (!status || status == "sent") {
            lastIndex = list.length - 1 - +index;
            break;
          }
        }
        this.socket.send(
          JSON.stringify({
            method: "last",
            payload: {
              fromDate: this.getState().list[lastIndex]?.dateCreate,
            },
          })
        );
        break;
      case "last":
        let newList = this.getState().list;
        if (newList[newList.length - 1]?._id == data.payload.items[0]?._id) {
          newList = [...newList.concat(data.payload.items.slice(1))];
        } else {
          newList = [...this.getState().list, ...data.payload.items];
        }
        this.setState(
          {
            ...this.getState(),
            list: newList,
          },
          "Подгрузились последние сообщения"
        );
        break;
      case "post":
        let newMessage = data.payload;
        if (newMessage.author?._id == this.userId) {
          const newList = this.getState().list;
          for (let index in newList) {
            const key = newList[newList.length - 1 - +index]._key;
            if (key == newMessage._key) {
              newList[newList.length - 1 - +index] = {...newMessage, status: "sent"};
              this.setState({
                ...this.getState(),
                list: [...newList]
              })
              return;
            }
          }
        }
        this.setState({
          ...this.getState(),
          list: [...this.getState().list, newMessage]
        });
        break;
      case "old":
        if (
          data.payload.items[data.payload.items.length - 1]._id !==
          this.getState().list[0]._id
        ) {
          return;
        }
        this.setState(
          {
            ...this.getState(),
            list: [...data.payload.items.slice(0, data.payload.items.length - 1).concat(this.getState().list)],
          },
          "Подгрузились старые сообщения"
        );
        break;

      default:
        break;
    }
  }

  onSendMessage(text: string) {
    if (!this.socket || this.socket.readyState !== this.socket.OPEN) {
      return;
    }
    const _key = uuidv4();
    this.setState({
      ...this.getState(),
      list: [
        ...this.getState().list,
        {
          _id: _key,
          _key,
          dateCreate: new Date().toString(),
          text,
          status: "load",
          author: {
            _id: this.userId
          }
        },
      ],
    });
    this.socket.send(
      JSON.stringify({
        method: "post",
        payload: {
          _key, // любым способом генерируем уникальный ключ
          text,
        },
      })
    );
  }

  onRequestOldMessages() {
    if (
      this.getState().list.length == 0 ||
      !this.socket ||
      this.socket.readyState !== this.socket.OPEN
    ) {
      return;
    }
    this.socket.send(
      JSON.stringify({
        method: "old",
        payload: {
          fromId: this.getState().list[0]._id,
        },
      })
    );
  }

  onOpen(token: string) {
    if (!this.socket) return;
    this.setState({
      ...this.getState(),
      connection: true,
    });
    this.socket.send(
      JSON.stringify({
        method: "auth",
        payload: {
          token,
        },
      })
    );
  }
}

export default ChatState;
