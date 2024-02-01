import codeGenerator from "@src/utils/code-generator";

class ModalService {

  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(services, config = {}) {
    this.services = services;
    this.listeners = [];
    this.types = {
      basket: 'basket',
      amount: 'amount',
      selectItems: 'selectItems',
      page: 'page'
    },
    this.generateId = codeGenerator()
    this.stack = [] // {
  }

  subscribe(listener) {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter(item => item !== listener);
    }
  }

  broadcast() {
    for (const listener of this.listeners) listener();
  }

  open({type, extraData, resolve}) {
    this.stack = [
      ...this.stack,
      { type, extraData, resolve, _id: this.generateId()}  
    ]
    this.broadcast()
  }

  close(id, result) {
    const index = this.stack.findIndex(m => m._id === id)
    const modal = this.stack[index]
    this.stack = [
      ...this.stack.slice(0, index),
      ...this.stack.slice(index + 1, this.stack.length)
    ]
    if (modal.resolve && result) {
      modal.resolve(result)
    }
    this.broadcast();
  }
}

export default ModalService;
