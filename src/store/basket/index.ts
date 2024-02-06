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
      waiting: false,
    }
  }

  /**
   * Добавление товара в корзину
   * @param _id {String|Number} Код товара
   * @param count {Number} Количество товара
   */
  async addToBasket(_id: string | number, count: number = 1) {
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
      let res = null;
      try {
        res = await this.services.api.request({url: `/api/v1/articles/${_id}`, timeout: 5000});
      } catch (err) {
        alert(err.message);
        this.setState({
          ...this.getState(),
          active: null,
        })
        return;
      }

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

  /**
   * Добавление в корзину по товару и количеству
   * @param item {Object} объект товара
   * @param count {Number} Количество товара
   */
  async addToBasketItem(item: TItem, count: number = 1) {
    let exist = false;
    let sum = 0;

    const list = this.getState().list.map((itemIn) => {
      let result = itemIn;

      if (itemIn._id === item._id) {
        exist = true;
        result = { ...itemIn, amount: itemIn.amount + count };
      }
      sum += result.amount * result.price;
      return result;
    });

    if (!exist) {
      item.amount = count;
      list.push(item);
      sum += count * item.price;
    }

    this.setState({
      ...this.getState(),
      list,
      sum,
      amount: list.length,
    });
  }

  /**
   * Добавление в корзину сразу нескольких элементов
   * @param items {Array} @example {_id: 1, count: 5}
   */
  async addMany(items: { _id: string | number; count: number }[]) {
    const params = {
      'search[ids]': Object.keys(items).join('|')
    };
    const urlParams = new URLSearchParams(params);

    let res = null;
    try {
      res = await this.services.api.request({ url: `/api/v1/articles?${urlParams}` })
    } catch (err) {
      alert(err.message);
      return;
    }

    const { items: requestedItems } = res.data.result;

    requestedItems.forEach((item: TItem) => {
      this.addToBasketItem(item, items[item._id]);
    });
  }

  /**
   * Удаление товара из корзины
   * @param _id Код товара
   */
  removeFromBasket(_id: string | number) {
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
   * Добавление активного товара в корзину
   */
  addActiveToBasket() {
    const active = this.getState().active;

    this.addToBasket(
      active._id,
      active.countToAdd,
    );
  }

  /**
   * Добавление активного элемента
   * @param item
   */
  setActive(item: string | number) {
    this.setState({
      ...this.getState(),
      active: item,
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
  setCountToAdd(count: number) {
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
