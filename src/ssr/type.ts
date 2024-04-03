export type ConfigSSR = {
  isFirstRender: boolean;
}

export type TPromiseState = Map<string, Promise<unknown>>
