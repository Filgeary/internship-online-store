import { Message } from "@src/types";
import type * as modules from "./exports"; 

export type Modules = {
  [K in keyof typeof modules]: InstanceType<typeof modules[K]>
}

export type ModuleNames = keyof Modules


export type WebSocketConfig = {
  url: string
}

type ClientWithSessionOptions = {
  needSession: true,
  onSessionInit?: Function | undefined,
  onSessionReconnect?: Function,
  subscriptions: {
    [K in keyof Modules]?: Parameters<Modules[K]['subscribe']>[0]
  }
}

type ClientWithoutSessionOptions  = {
  needSession?: never,
  onSessionInit?: never,
  onSessionReconnect?: never,
  subscriptions: {
    [K in keyof Modules]?: Parameters<Modules[K]['subscribe']>[0]
  }
}

export type ClientOptions = ClientWithSessionOptions | ClientWithoutSessionOptions

export type Client = ClientOptions & {_id: string}

export type ReceivedMessage = Omit<Message, 'receivedFromServer'>