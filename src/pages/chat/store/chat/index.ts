import StoreModule from "@src/shared/store/module";
import {generateUniqueCode} from "@src/shared/utils/unique-code";
import {filterDuplicatesByField} from "@src/shared/utils/filter-duplicates-by-field";

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

  async send(text: string, key?: string) {
    const _key = key || generateUniqueCode();
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

    const confirmationSending = await this.services.websocket.send(this.config.connectionName, {
      method: 'post',
      payload: {_key, text}
    })
    console.log(confirmationSending)
    if (!confirmationSending) {
      const unsentMessages = localStorage.getItem('unsentMessages') || JSON.stringify([])

      localStorage.setItem('unsentMessages', JSON.stringify([
        ...JSON.parse(unsentMessages),
        {...newMessage, waiting: false, sendingError: true}
      ]))

      this.settingMessage([{...newMessage, waiting: false, sendingError: true}])

    }

  }

  resetMessage() {
    this.services.websocket.send(this.config.connectionName, {
      method: 'clear',
      payload: {}
    })
  }
}

export default ChatState;
