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
      active: null,
    }
  }

  /**
   * Добавление товара в корзину
   * @param _id {String} Код товара
   * @param count {Number} Количество товара
   */
  async addToBasket(_id, count = 1) {
    let sum = 0;
    // Ищем товар в корзине, чтобы увеличить его количество
    let exist = false;
    const list = this.getState().list.map(item => {
      let result = item;
      if (item._id === _id) {
        exist = true; // Запомним, что был найден в корзине
        result = {...item, amount: item.amount + count};
      }
      sum += result.price * result.amount;
      return result;
    });

    if (!exist) {
      // Поиск товара в каталоге, чтобы его добавить в корзину.
      const res = await this.services.api.request({url: `/api/v1/articles/${_id}`});
      console.log(res);
      const item = res.data.result;

      list.push({...item, amount: count}); // list уже новый, в него можно пушить.
      // Добавляем к сумме.
      sum += item.price * count;
    }

    this.setState({
      ...this.getState(),
      list,
      sum,
      amount: list.length,
      active: null,
    }, 'Добавление в корзину');
  }

  async addMany(items) {
    for (const itemId in items) {
      await this.addToBasket(itemId, items[itemId]);
    }
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
   * Добавление активного элемента
   * @param item
   */
  setActive(item) {
    this.setState({
      ...this.getState(),
      active: item
    });
  }

  /**
   * Удаление активного элемента
   */
  resetActive() {
    this.setState({
      ...this.getState(),
      active: null,
    });
  }

  /**
   * Добавление к активному элементу количества
   * @param count
   */
  setCountToAdd(count) {
    this.setState({
      ...this.getState(),
      active: {
        ...this.getState().active,
        countToAdd: count,
      }
    });
  }
}

export default BasketState;
