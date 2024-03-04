import StoreModule from "../module";
import { TChatState, TMessages } from "./type";
import { v4 as uuidv4 } from "uuid";

class ChatState extends StoreModule<TChatState> {
  initState(): TChatState {
    return {
      connection: false,
      messages: [],
      timeId: null,
      waiting: false,
      fromId: "",
    };
  }
  request() {
    this.onConnect();
    this.getState().timeId = setTimeout(() => this.getLastMessages(), 1000);
  }

  onConnect() {
    this.services.ws.connect("/chat");
    const ws = this.services.ws.ws!;
    ws.onopen = () => {
      this.setState(
        {
          ...this.getState(),
          connection: true,
        },
        "Соединение установлено"
      );

      const token = localStorage.getItem("token") as string;
      this.services.ws.send("auth", {
        token: token,
      });

      ws.onmessage = (event: MessageEvent<any>) => {
        const messages = JSON.parse(event.data) as TMessages;

        if (messages.method === "last") {
          this.setState(
            {
              ...this.getState(),
              waiting: true,
            },
            "Ожидание загрузки сообщений"
          );
          this.messagesHandler(messages);
        }

        if (messages.method === "post") {
          this.setState(
            {
              ...this.getState(),
              waiting: true,
            },
            "Ожидание отправки сообщения"
          );
          if (!("items" in messages.payload)) {
            this.setState(
              {
                ...this.getState(),
                messages: [...this.getState().messages, messages.payload],
                waiting: false,
              },
              "Сообщение отправлено"
            );
          }
        }

        if (messages.method === "old") {
          this.setState(
            {
              ...this.getState(),
              waiting: true,
            },
            "Ожидание загрузки сообщений"
          );
          this.messagesHandler(messages);
        }

        if (messages.method === "clear") {
          this.setState(
            {
              ...this.getState(),
              waiting: true,
            },
            "Ожидание очистки сообщений"
          );
          if (!("items" in messages.payload)) {
            this.setState(
              {
                ...this.getState(),
                messages: [],
                waiting: false,
              },
              "Сообщения удалены"
            );
          }
        }
      };
      ws.onclose = () => {
        if (this.getState().connection) this.request();
        this.setState(
          {
            ...this.getState(),
            connection: false,
            timeId: null,
          },
          "Соединение закрыто"
        );
      };

      ws.onerror = () => {
        console.log("Произошла ошибка");
      };
    };
  }

  /**
   * Закрытие соединения
   */
  close() {
    this.services.ws.close();

    this.setState(
      {
        ...this.getState(),
        connection: false,
        timeId: null,
      },
      "Соединение закрыто"
    );
  }

  /**
   * Отправка нового сообщения
   */
  newMessage(message: string) {
    if (this.services.ws.ws) {
      this.services.ws.send("post", {
        _key: uuidv4(),
        text: message,
      });
    }
  }

  /**
   * Запрос новых сообщений
   */
  getLastMessages() {
    if (this.services.ws.ws) {
      this.services.ws.send("last", {});
    }
  }

  /**
   * Запрос старых сообщений
   */
  getOldMessages() {
    if (this.services.ws.ws) {
      this.services.ws.send("old", {
        fromId: this.getState().fromId,
      });
    }
  }

  messagesHandler(response: TMessages) {
    if ("items" in response.payload) {
      {
        let fromId = response.payload.items[0]._id;
        let items;
        if (this.getState().messages.length > 0) {
          let one = this.getState().messages.shift()!;
          items = this.getState().messages.filter((el) => el._id !== one._id);
        }

        const messages = [
          ...response.payload.items,
          ...(items ? items : this.getState().messages),
        ];

        this.setState(
          {
            ...this.getState(),
            fromId,
            messages,
            waiting: false,
          },
          "Сообщения загружены"
        );
      }
    } else {
      const messages = [...this.getState().messages, response.payload];
      this.setState(
        {
          ...this.getState(),
          messages,
          waiting: false,
        },
        "Сообщение загружено"
      );
    }
  }

  /**
   * Удаление всех сообщений
   */
  /*   clearAll() {
    if (this.services.ws.ws) {
      this.services.ws.send("clear", {});
    }
  } */
}

export default ChatState;
