import StoreModule from "../module";
import { IChatState, IChat } from "./types";
import generateUniqueId from "@src/utils/unicque_id";

/**
 * Список категорий
 */
class ChatState extends StoreModule<IChatState> {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): IChatState {
    return {
      messages: [],
      message: '',
      connected: false,
    };
  }

  onConnect() {
    // Установка соединения
    this.services.socket.connect("example.front.ylab.io/chat");

    this.services.socket.socket!.onopen = () => {
      this.setState(
        {
          ...this.getState(),
          connected: true,
        },
        "Соединение установлено"
      );

      const token = localStorage.getItem("token");
      this.services.socket.socket!.send(
        JSON.stringify({
          method: "auth",
          payload: {
            token: token,
          },
        })
      );
      
      this.services.socket.socket!.onmessage = (event: MessageEvent<any>) => {
        const message = JSON.parse(event.data) as any;
        this.setState(
          {
            ...this.getState(),
            messages: [...this.getState().messages, message],
          }
        );
      };
      
      this.services.socket.socket!.onclose = () => {
        console.log("Socket закрыт");
      };
      
      this.services.socket.socket!.onerror = () => {
        console.log("Socket произошла ошибка");
      };
    };
  }

  /**
   * Закрытие WebSocket соединения
   */
  close() {
    this.services.socket.close();

    this.setState({
      ...this.getState(),
      connected: false,
    });
  }

  /**
   * Новое сообщение
   */
  newMessage(text: string) {
    if (this.getState().connected) {
      this.services.socket.socket!.send(
        JSON.stringify({
          method: "post",
          payload: {
            _key: generateUniqueId(),
            text: text,
          },
        })
      );
    }
  }
}

// onOpen(event: Event) {
//   const socket = this.services.socket as unknown as WebSocket;
//   const token = localStorage.getItem("token");
//   console.log("event", event);
//   if (token) {
//     socket.send(
//       JSON.stringify({
//         method: "auth",
//         payload: {
//           token: token,
//         },
//       })
//     );
//   } else {
//     console.error("Token not found in localStorage.");
//   }
// }

// onMessage(event: MessageEvent<any>) {
//   const messageFromServer = JSON.parse(event.data) as IChat;
//   console.log("messageFromServer", messageFromServer);
//   //Сообщение загружено успешно
//   this.setState(
//     {
//       ...this.getState(),
//       messages: [...this.getState().messages, messageFromServer],
//       waiting: false,
//     },
//     "Сообщение загружено"
//   );
// }

/**
 * Установка WebSocket соединения
 */
// onConnect() {

//   // Установка соединения
//   this.services.socket.connect("example.front.ylab.io/chat")

//   // Установка слушателя события "open"
//   this.services.socket.socket!.addEventListener("open", (event: Event) => {
//     const socket = this.services.socket as unknown as WebSocket;
//     const token = localStorage.getItem("token");
//     console.log("event", event);
//     if (token) {
//       socket.send(
//         JSON.stringify({
//           method: "auth",
//           payload: {
//             token: token,
//           },
//         })
//       );
//     } else {
//       console.error("Token not found in localStorage.");
//     }
//   })

//   // Установка слушателя события "message"
//   this.services.socket.socket!.addEventListener("message", (event: MessageEvent<any>) => {
//     const messageFromServer = JSON.parse(event.data) as IChat;
//     console.log("messageFromServer", messageFromServer);

//     //Сообщение загружено успешно
//     this.setState(
//       {
//         ...this.getState(),
//         messages: [...this.getState().messages, messageFromServer],
//         waiting: false,
//       },
//       "Сообщение загружено"
//     );
//   })

//   this.setState(
//     {
//       ...this.getState(),
//       waiting: true,
//     })

// }

// /**
//  * Новое сообщение
//  */
// newMessage(text: string) {
//   if(this.getState().waiting) {
//     this.services.socket.socket!.send(
//       JSON.stringify({
//         method: "auth",
//         payload: {
//           _key: generateUniqueId(),
//           text: text
//         },
//       })
//     );
//   }
// }

// /**
//  * Запрос свежих сообщений
//  */
// requestLatestMessages() {
//   this.services.socket.socket!.send(JSON.stringify({
//     method: 'last',
//     payload: {
//       fromDate: null
//     }
//   }))

// }

// /**
//  * Закрытие WebSocket соединения
//  */
// close() {
//   this.services.socket.close();

//   this.setState(
//     {
//       ...this.getState(),
//       waiting: false,
//     })

//   this.services.socket.socket?.removeEventListener("open", (event: Event) => {
//     const socket = this.services.socket as unknown as WebSocket;
//     const token = localStorage.getItem("token");
//     console.log("event", event);
//     if (token) {
//       socket.send(
//         JSON.stringify({
//           method: "auth",
//           payload: {
//             token: token,
//           },
//         })
//       )
//     } else {
//       console.error("Token not found in localStorage.");
//     }
//   })
//   this.services.socket.socket?.removeEventListener("message",  (event: MessageEvent<any>) => {
//     const messageFromServer = JSON.parse(event.data) as IChat;
//     console.log("messageFromServer", messageFromServer);
//     //Сообщение загружено успешно
//     this.setState(
//       {
//         ...this.getState(),
//         messages: [...this.getState().messages, messageFromServer],
//         waiting: false,
//       },
//       "Сообщение загружено"
//     );
//   })
// }

export default ChatState;
