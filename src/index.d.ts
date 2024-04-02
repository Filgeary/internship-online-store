import { TState } from "./types/type";
export {};

declare global {
  interface Window {
    __INITIAL_DATA__?: TState;
  }
}
