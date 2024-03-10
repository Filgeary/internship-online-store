import StoreModule from "@src/store/module";
import {generateUniqueCode} from "@src/utils/unique-code";
import {filterDuplicatesByField} from "@src/utils/filter-duplicates-by-field";
import {element} from "prop-types";
import {Simulate} from "react-dom/test-utils";
import waiting = Simulate.waiting;

type MessageAuthor = {
  _id: string,
  username: string,
  profile: {
    name: string,
    avatar: any,
  }
}

export type Message = {
  _id: string,
  _key: string,
  text: string,
  title: string,
  author: MessageAuthor,
  dateCreate: string,
  waiting?: boolean
}

type SendMessage = {}

type TChatState = {
  message: Message[],
  waiting: boolean,
  lastValueOfKeys: string[]
}

type TChatConfig = { connectionName: string }


class ChatState extends StoreModule<TChatState, TChatConfig> {
  initState(): TChatState {
    return {
      message: [],
      waiting: true,
      lastValueOfKeys: []
    }
  }

  async initChat() {
    const token = localStorage.getItem('token')
    if (token) {
      const connection = await this.services.websocket.connect(
        this.config.connectionName,
        this.store.actions.chat.processingMessage,
        {method: 'auth', payload: {token}}
      )
      if (!connection) {
        new Error(`Подключение не установлено URL: ${this.config.connectionName} Module: ${ChatState}`)
      }
    }
    this.setState({
      ...this.getState(),
      waiting: false
    })
  }

  processingMessage = (message: any) => {
    const method = message.method
    let payload = message.payload || []
    switch (method) {
      case "auth": {
        if (message.payload.result) {
          this.services.websocket.send(this.config.connectionName, {
            method: 'last',
            payload: {}
          })
        }
        break
      }
      case "last": {
        this.settingMessage(payload.items.map((element: Message) => ({...element, waiting: false})))
        break
      }
      case "old": {
        this.settingMessage(payload.items.map((element: Message) => ({...element, waiting: false})))
        break
      }
      case "post": {
        this.settingMessage([{...payload, waiting: false}])
        break
      }
      case "clear": {
        this.setState({
          ...this.getState(),
          waiting: false,
          message: []
        })
        break
      }
      default: {
        this.setState({
          ...this.getState(),
          waiting: false,
          message: []
        })
        return;
      }
    }
    this.setState({
      ...this.getState(),
      waiting: false,
    })
  }

  private settingMessage(message: Message[]) {
    const newMessageState = filterDuplicatesByField('_key', message, this.getState().message) as Message[]
    const sortedByDate = newMessageState.sort((a, b) => (
      new Date(a.dateCreate).getTime() - new Date(b.dateCreate).getTime()
    ));
    this.setState({
      ...this.getState(),
      message: sortedByDate,
      waiting: false
    })
  }

  uploadOldMessage = (_id?: string) => {
    const fromId = _id || this.getState().message[0]._id
    this.services.websocket.send(this.config.connectionName, {
      method: 'old',
      payload: {fromId}
    })
  }

  send(text: string) {
    const _key = generateUniqueCode();
    this.setState({
      ...this.getState(),
      lastValueOfKeys: [...this.getState().lastValueOfKeys, _key],
    })
    const newMessage = {
      _key,
      text,
      author: {
        username: this.store.state.session.user.username
      },
      dateCreate: (new Date()).toISOString(),
      waiting: true,
    } as Message;
    this.settingMessage([newMessage])
    this.services.websocket.send(this.config.connectionName, {
      method: 'post',
      payload: {_key, text}
    })
  }

  resetMessage() {
    this.services.websocket.send(this.config.connectionName, {
      method: 'clear',
      payload: {}
    })
  }
}

export default ChatState;
