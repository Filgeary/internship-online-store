import codeGenerator from "@src/utils/code-generator";
import StoreModule from "../module";
import type Store from "..";
import { ModalCodes, type ModalsState, type Modals, ModalsConfig} from "./types";
import { ModuleNames, StoreConfig } from "../types";

class ModalsModule extends StoreModule<ModalsState, ModalsConfig> {
  protected generateId: Function
  types: {
    [key in keyof typeof ModalCodes]: typeof ModalCodes[key]
  }
  constructor(...params: [Store, ModuleNames, ModalsConfig]) {
    super(...params);
    this.generateId = codeGenerator(1);
    this.types = {
      basket: ModalCodes.basket,
      amount: ModalCodes.amount,
      selectItems: ModalCodes.selectItems,
    };
  }

  initState(): ModalsState {
    return {
      stack: []
    }
  }

  open<T extends ModalCodes>({type, extraData, resolve}: {
    type: T,
    extraData?: Modals[T]['extraData'],
    resolve?: Modals[T]['resolve']
  }): void {
    const state = this.getState();
    const _id = type + '_' + this.generateId();
    this.setState({
      ...state,
      stack: [
        ...state.stack,
        { type, extraData, resolve, _id} as Modals[T]
      ]
    }, `Открытие модалки ${type}, c id ${_id}`);
  }

  close<T extends ModalCodes>(
      _id: `${T}_${number}`, 
      result?: T extends ModalCodes.amount 
        ? number | undefined
        : T extends ModalCodes.selectItems
          ? string[] | undefined
          : never 
    ): void{
    const state = this.getState();
    const index = state.stack.findIndex(m => m._id === _id);
    const modal = state.stack[index] as Modals[T];
    this.setState({
      ...state,
      stack: [
        ...state.stack.slice(0, index),
        ...state.stack.slice(index + 1, state.stack.length)
      ]
    }, `Закрытие модалки ${modal.type}, c id ${modal._id}`);

    if (modal.resolve && result) {
      if (modal.type === ModalCodes.selectItems) {
        modal.resolve(result as (string[] | undefined));
      } else if (modal.type === ModalCodes.amount) {
        modal.resolve(result as (number | undefined));
      }
    };
  }
}

export default ModalsModule;
