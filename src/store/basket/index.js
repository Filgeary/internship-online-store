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
      waiting: false
    }
  }

  /**
   * Изменение кода Активного, ожидающего товара
   * @param _id {String} Код товара
   */
  // setActiveItemId(_id) {
  //   this.setState({
  //     ...this.getState(),
  //     activeItemId: _id
  //   })
  // }

  /**
   * Добавление активного товара в корзину
   * @param count {Number} Количество товара
   */
  // async addActiveItem(count) {
  //   const itemId = this.getState().activeItemId;
  //   this.setActiveItemId(null);
  //   await this.addToBasket(itemId, count);
  // }

  /**
   * Добавление товара в корзину
   * @param _id {String} Код товара
   * @param count {Number} Количество товара
   */
  async addToBasket(_id, count = 1) {
    if (isNaN(count) || count < 1) {
      return;
    }
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
      const item = res.data.result;

      list.push({...item, amount: count}); // list уже новый, в него можно пушить.
      // Добавляем к сумме.
      sum += item.price * count;
    }

    this.setState({
      ...this.getState(),
      list,
      sum,
      amount: list.length
    }, 'Добавление в корзину');
  }

  /**
   * Добавление нескольких товаров в корзину
   * @param itemsId {Array} Массив с кодами товара
   */
  async addToBasketItemsId(itemsId) {
    this.setState({
      ...this.getState(),
      waiting: true
    }, 'Ожидание добавления в корзину');

    const itemsIdToAdd = itemsId;
    let sum = 0;
    // Ищем товар в корзине, чтобы увеличить его количество
    const list = this.getState().list.map(item => {
      let result = item;
      const indexOf = itemsIdToAdd.indexOf(item._id);
      if (indexOf != -1) {
        itemsIdToAdd.splice(indexOf, 1);
        result = {...item, amount: item.amount + 1};
      }
      sum += result.price * result.amount;
      return result;
    });

    if (itemsIdToAdd.length > 0) {
      console.log(itemsIdToAdd);
      const apiParams = {
        'search[ids]': itemsIdToAdd.join(" | "),
      }
      const res = await this.services.api.request({url: `/api/v1/articles?${new URLSearchParams(apiParams)}`});
      const items = res.data.result.items;
      
      for(const item of items) {
        list.push({...item, amount: 1}); // list уже новый, в него можно пушить.
        // Добавляем к сумме.
        sum += item.price;
      }
    }

    this.setState({
      ...this.getState(),
      list,
      sum,
      amount: list.length,
      waiting: false
    }, 'Добавление в корзину нескольких товаров');
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
}

export default BasketState;
