import Services from "@src/services";
import { ModuleNames, Modules, WebSocketConfig } from "./types"
import { v4 as uuidv4 } from 'uuid';
// import EventModule from "./module";
import * as EventModules from './exports'

// type ActiveClient = {
//   _id: string,

// }


class WebSocketService {

  services: Services
  connection: WebSocket | undefined
  config: WebSocketConfig
  events: Modules
  activeClients: number
  sessionClients: number
  onInitSessionCallbacks: Function[]
  reconnectSessionCallbacks: Function[]
  isAuthorized: boolean


  

  constructor(services: Services, config: WebSocketConfig) {
    this.services = services;
    this.config = config
    this.onInitSessionCallbacks = []
    this.reconnectSessionCallbacks = []
    this.isAuthorized = false
    const methods = Object.keys(EventModules) as (keyof Modules)[]
    let events = {} as Modules
    this.activeClients = 0
    this.sessionClients = 0
    const create = <Method extends keyof Modules>(method: Method) => {
      events[method] = new EventModules[method](
        services,
        //@ts-ignore
        method, 
      ) as Modules[Method]
    }
    for (const method of methods) {
      create(method)
    }
    this.events = events
  }

  establishConnection() {
    console.log('Устанавливаем соединение с: ' + this.config.url)
    this.connection = new WebSocket(this.config.url)
    this.connection.onopen = this.handleOpen.bind(this)
    this.connection.onmessage = this.handleMessage.bind(this)
    this.connection.onclose = this.handleClose.bind(this)
    this.connection.onerror = this.handleError.bind(this)
  }

  addClient({needSession, onInitSession, onReconnectSession }:{
    needSession: boolean,
    onInitSession?: Function,
    onReconnectSession?: Function
  }) {
    this.activeClients += 1
    if (needSession) {
      this.sessionClients += 1
    }
    if (onInitSession) {
      if (this.isAuthorized) {
        onInitSession()
      } else {
        this.onInitSessionCallbacks.push(onInitSession)
      }
    }
    if (onReconnectSession) {
      this.reconnectSessionCallbacks.push(onReconnectSession)
    }
    if (!this.connection) {
      this.establishConnection()
    }
    alert('client: ' + this.activeClients)

    return () => {
      this.activeClients -= 1
      if (needSession) {
        this.sessionClients -= 1
      }
      if (onReconnectSession) {
        this.reconnectSessionCallbacks = this.reconnectSessionCallbacks
        .filter(func => func === onReconnectSession)
      }
      if (this.activeClients === 0) this.killConnection()
      alert('client: ' + this.activeClients)
    }
  }

  killConnection() {
    console.log('Убиваем соединение c ' + this.config.url)
    if (!this.connection) return
    this.connection.onopen = null
    this.connection.onmessage = null
    this.connection.onclose = null
    this.connection.onerror = null
    this.connection.close()
    this.connection = undefined
    this.isAuthorized = false
  }

  handleOpen() {
    console.log('Соединение установлено')
    if (this.sessionClients) {
      this.emitSignIn()
    }
  }

  handleMessage(e: MessageEvent) {
    const data = JSON.parse(e.data)
    if (data.method === 'auth') {
      this.handleSignInResult(data.payload.result)
    } 

    if ((Object.keys(this.events)).includes(data.method)) {
      this.events[data.method as ModuleNames].handleEvent(data.payload)
    }
  }

  handleClose() {
    this.reestablishConnection()
  }

  handleError() {
    this.reestablishConnection()
  }


  emitSignIn() {
    this.connection?.send(JSON.stringify({
      method: 'auth',
      payload: {
        token: this.services.store.getState().session.token
      }
    }))
  }

  handleSignInResult(result: boolean) {
    if (result) {
      this.isAuthorized = true
      this.onInitSessionCallbacks = this.onInitSessionCallbacks.filter(cb => {
        cb()
        return false
      })
      this.reconnectSessionCallbacks.map(cb => cb())
    } else {
      this.reestablishConnection()
    }
  }


  reestablishConnection() {
    this.killConnection()
    setTimeout(() => {
      this.establishConnection()
    }, 1000)
  }

  emitEvent(method: string, payload: object) {
    this.connection?.send(JSON.stringify({
      method, payload
    }))
  }  

}

export default WebSocketService