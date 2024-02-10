import codeGenerator from "@src/utils/code-generator";
import StoreModule from "../module";
import type Store from "..";
import { EModalTypes, type IModal, type IModalState } from "./types";




class ModalsState extends StoreModule<IModalState> {
  protected generateId: Function
  types: {
    [key in keyof typeof EModalTypes]: typeof EModalTypes[key]
  }
  constructor(...params: [Store, string, object]) {
    super(...params);
    this.generateId = codeGenerator(1);
    this.types = {
      basket: EModalTypes.basket,
      amount: EModalTypes.amount,
      selectItems: EModalTypes.selectItems,
    };
  }

  initState(): IModalState {
    return {
      stack: []
    }
  }

  open({type, extraData, resolve}: Pick<IModal, 'type' | 'extraData' | 'resolve'>): void {
    const state = this.getState();
    const _id = this.generateId();
    this.setState({
      ...state,
      stack: [
        ...state.stack,
        { type, extraData, resolve, _id} 
      ]
    }, `Открытие модалки ${type}, c id ${_id}`);
  }

  close(_id: number, result?: any){
    const state = this.getState();
    const index = state.stack.findIndex(m => m._id === _id);
    const modal = state.stack[index];
    this.setState({
      ...state,
      stack: [
        ...state.stack.slice(0, index),
        ...state.stack.slice(index + 1, state.stack.length)
      ]
    }, `Закрытие модалки ${modal.type}, c id ${modal._id}`);

    if (modal.resolve && result) {
      modal.resolve(result);
    };
  }
}

export default ModalsState;
