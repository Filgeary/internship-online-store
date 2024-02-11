import React from "react";
import Store from ".";

/**
 * Контекст для Store
 * @type {React.Context<Store>}
 */
export const StoreContext: React.Context<Store | null> =
  React.createContext<Store | null>(null);
