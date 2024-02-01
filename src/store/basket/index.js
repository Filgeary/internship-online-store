import StoreModule from "../module";

/**
 * Покупательская корзина
 */
class BasketState extends StoreModule {

  initState() {
    return {
      list: [],
      sum: 0,
      amount: 0,
      quantity: 0,
      selected: []
    }
  }

  /**
   * Добавление товара в корзину
   * @param _id {String} Код товара
   */
  async addToBasket(_id, amountGoods) {
    let sum = 0;
    // Ищем товар в корзине, чтобы увеличить его количество
    let exist = false;
    const list = this.getState().list.map(item => {
      let result = item;
      if (item._id === _id) {
        exist = true; // Запомним, что был найден в корзине
        amountGoods 
        ? result = {...item, amount: item.amount + amountGoods}
        : result = {...item, amount: item.amount + 1}
      }
      sum += result.price * result.amount;
      return result;
    });

    if (!exist) {
      // Поиск товара в каталоге, чтобы его добавить в корзину.
      const res = await this.services.api.request({url: `/api/v1/articles/${_id}`});
      const item = res.data.result;

      list.push({...item, amount: amountGoods ? amountGoods : 1}); // list уже новый, в него можно пушить.
      // Добавляем к сумме.
      amountGoods 
        ? sum += item.price * amountGoods
        : sum += item.price
    }
    this.setState({
      ...this.getState(),
      list,
      sum,
      amount: list.length,
      quantity: 0
    }, 'Добавление в корзину');
  }

  /**
   * Удаление товара из корзины
   * @param _id Код товара
   */
  removeFromBasket(_id) {
    let sum = 0;
    const list = this.getState().list.filter(item => {
      if (item._id === _id) return false;
      sum += item.price * item.amount;
      return true;
    });

    this.setState({
      ...this.getState(),
      list,
      sum,
      amount: list.length
    }, 'Удаление из корзины');
  }

   /**
   * Добавление результата модального окна с количеством товара
   * @param quantity {Number}
   */
   updateQuantityProduct(quantity) {
    this.setState({
      ...this.getState(),
      quantity
    });
  }

  /**
   * Добавление объекта в selected 
   * @param {Array}
   */
  updateSelected(selectedId) {
    this.setState({
      ...this.getState(),
      selected: [...this.getState().selected, {
        id: selectedId, 
        quantity: this.getState().quantity
      }],
      quantity: 0
    });
  }

   /**
   * Удаление объекта из selected
   * @param _id Код товара
   */
   removeFromSelected(id) {
    this.setState({
      ...this.getState(),
      selected: this.getState().selected.filter(item => item.id !== id)
    })
  }

  /**
   * Добавление выбранных товаров из модального окна
   * @param {}
   */
  async addingSelectedProducts () {
    
    const selected = this.getState().selected
    
    if (selected.length === 0) {
      return;
    }
  
    // Получаем первый объект из массива и удаляем его из массива
    const firstSelected = selected.shift();
  
    // Добавляем товар в корзину
    await this.addToBasket(firstSelected.id, firstSelected.quantity);
  
    // Рекурсивно вызываем эту же функцию для оставшихся объектов
    await this.addingSelectedProducts(selected);
  
    // });
  }
}

export default BasketState;
