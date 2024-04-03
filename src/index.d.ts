import express from "express";
import { TState } from "./types/type";
export {};

declare global {
  interface Window {
    __PRELOADED_STATE__?: TState;
  }
}


declare global {
  namespace Express {
    interface Request {
      _parsedUrl?: Record<string, any>;
    }
  }
}
