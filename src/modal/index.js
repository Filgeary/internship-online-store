class ModalService {

  /**
   * @param services {Services} Менеджер сервисов
   * @param config {Object}
   */
  constructor(services, config = {}) {
    this.services = services;
    this.activeName = undefined
    this.listeners = [];
    this.resolve = undefined;
    this.list = {
      basket: 'basket',
      addToBasket: 'addToBasket'
    },
    this.async = [
      this.list.addToBasket
    ]
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

  open(name) {
    if (this.resolve) {
      this.resolve();
      this.resolve = undefined;
    }
    this.activeName = name;
    if (this.async.includes(name)) {
      return new Promise((res) => {
        this.resolve = res;
        this.broadcast();
      })
    } else {
      this.broadcast();
    }
  }

  close(result) {
    this.activeName = undefined;
    if (this.resolve && result) {
      this.resolve(result);
    }
    this.resolve = undefined;
    this.broadcast();
  }
}

export default ModalService;
