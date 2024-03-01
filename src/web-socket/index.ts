import Services from "@src/services";
import { Client, ClientOptions, ModuleNames, Modules, WebSocketConfig } from "./types"
import { v4 as uuidv4 } from 'uuid';
import * as EventModules from './exports'

class WebSocketService {

  services: Services
  connection: WebSocket | undefined
  config: WebSocketConfig
  clients: Client[]
  events: Modules
  isAuthorized: boolean

  constructor(services: Services, config: WebSocketConfig) {
    this.services = services;
    this.config = config
    this.isAuthorized = false
    this.clients = []
    const methods = Object.keys(EventModules) as (keyof Modules)[]
    let events = {} as Modules
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
    this.connection = new WebSocket(this.config.url);
    this.connection.onopen = this.handleOpen.bind(this);
    this.connection.onmessage = this.handleMessage.bind(this);
    this.connection.onclose = this.handleClose.bind(this);
    this.connection.onerror = this.handleError.bind(this);
  }

  public addClient(options: ClientOptions) {
    //Подписки на модули
    const subscriptionsKeys = Object.keys(options.subscriptions) as ModuleNames[]
    const unsubscribeModules: Function[] = []
    for (let key of subscriptionsKeys) {
      const subscriptionsKey = key as ModuleNames
      if (options.subscriptions[subscriptionsKey]) {
        unsubscribeModules.push(
          //@ts-ignore
          this.events[subscriptionsKey].subscribe(options.subscriptions[subscriptionsKey])
        )
      }
    }

    //Вызываем инициализирующую функцию, требующую сессию,
    //если сессия активна
    if (options.onSessionInit && this.isAuthorized) {
      options.onSessionInit();
      options.onSessionInit = undefined;
    };
    //Переподключаемся для авторизации или установления соединения
    if (!this.isAuthorized && options.needSession || !this.connection) {
      this.reestablishConnection();
    } 
    //Добавляем клиента в массив
    const client = { _id: uuidv4(), ...options };
    this.clients.push(client);

    console.log('Клиент ' + client._id + ' добавлен');
    console.log('Клиенты webSocketService:');
    console.log(this.clients);

    //Возвращаем функцию удаления клиента из массива
    return () => {
      unsubscribeModules.forEach(f => f())
      this.clients = this.clients.filter(cl => cl !== client); 
      //Если клиентов нет, разрываем соединение
      if (!this.clients.length) this.killConnection();
      //Если нет клиентов, требующих сессию
      if (!this.clients.reduce((acc,cl) => cl.needSession ? ++acc : acc, 0) && this.clients.length) {
        this.reestablishConnection();
      };
      console.log('Клиент ' + client._id + ' удален');
      console.log('Клиенты webSocketService:');
      console.log(this.clients);
    };
  }

  killConnection() {
    if (!this.connection) return;
    this.connection.onopen = null;
    this.connection.onmessage = null;
    this.connection.onclose = null;
    this.connection.onerror = null;
    this.connection.close();
    this.connection = undefined;
    this.isAuthorized = false;
    console.log('Соединение разорвано');
    console.log('Клиенты webSocketService:');
    console.log(this.clients);
  }

  private handleOpen() {
    //Если есть клиенты, требующие сессию, авторизируем
    if (this.clients.reduce((acc,cl) => cl.needSession ? ++acc : acc, 0)) {
      this.emitSignIn()
    }
    console.log('Соединение установлено');
    console.log('Клиенты webSocketService:');
    console.log(this.clients);
  }

  private handleMessage(e: MessageEvent) {
    const data = JSON.parse(e.data)
    if (data.method === 'auth') {
      this.handleSignInResult(data.payload.result)
    } 

    if ((Object.keys(this.events)).includes(data.method)) {
      this.events[data.method as ModuleNames].handleEvent(data.payload)
    }
  }

  private handleClose() {
    this.reestablishConnection()
  }

  private handleError() {
    this.reestablishConnection()
  }


  private emitSignIn() {
    if (!this.connection) this.reestablishConnection();
    this.connection!.send(JSON.stringify({
      method: 'auth',
      payload: {
        token: this.services.store.getState().session.token
      }
    }))
  }

  private handleSignInResult(result: boolean) {
    if (result) {
      this.isAuthorized = true
      this.clients.map(cl => {
        if (cl.onSessionInit) {
          cl.onSessionInit()
          cl.onSessionInit = undefined
        } else if (cl.onSessionReconnect) {
          cl.onSessionReconnect()
        }
        return cl
      })
    } else {
      //Если есть клиенты, требующие сессию, повторяем событие auth
      if (this.clients.reduce((acc,cl) => cl.needSession ? ++acc : acc, 0)) {
        this.emitSignIn()
      }
    }
  }


  private reestablishConnection() {
    this.killConnection()
    setTimeout(() => {
      this.establishConnection()
    }, 1000)
    console.log('Переустанавливаем соединение');
    console.log('Клиенты webSocketService:');
    console.log(this.clients);
  }

  public emitEvent(method: string, payload: object) {
    //Todo может потеряться
    this.connection?.send(JSON.stringify({
      method, payload
    }))
  }  

}

export default WebSocketService