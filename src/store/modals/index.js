import codeGenerator from "@src/utils/code-generator";
import StoreModule from "../module";

class ModalsState extends StoreModule {

  constructor(...params) {
    super(...params);
    this.generateId = codeGenerator(1);
    this.types = {
      basket: 'basket',
      amount: 'amount',
      selectItems: 'selectItems',
    };
  }

  initState() {
    return {
      stack: []
    }
  }

  open({type, extraData, resolve}){
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

  close(id, result){
    const state = this.getState();
    const index = state.stack.findIndex(m => m._id === id);
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
