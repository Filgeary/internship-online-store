import type * as modules from "./exports"; 

export type Modules = {
  [K in keyof typeof modules]: InstanceType<typeof modules[K]>
}

export type ModuleNames = keyof Modules


export type WebSocketConfig = {
  url: string
}