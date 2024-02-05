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
      lock: false,
    }
  }

  /**
   * Добавление товара в корзину
   * @param _id {String} Код товара
   * @param pcs {Number} Количество которое надо добавить
   */
  async addToBasket(_id, pcs = 1) {
    let lock = this.getState().lock;
    let i = 0;
    while (lock && i < 1000) {
      await new Promise(resolve => setTimeout(() => resolve(), 100));
      lock = this.getState().lock;
      i++;
    }

    this.setState({
      ...this.getState(),
      lock: true,
    }, 'Начинаем добавление в корзину');

    const pcsNum = Number(pcs);
    let sum = 0;
    // Ищем товар в корзине, чтобы увеличить его количество
    let exist = false;
    const list = this.getState().list.map(item => {
      let result = item;
      if (item._id === _id) {
        exist = true; // Запомним, что был найден в корзине
        result = {...item, amount: item.amount + pcsNum};
      }
      sum += result.price * result.amount;
      return result;
    });

    if (!exist) {
      // Поиск товара в каталоге, чтобы его добавить в корзину.
      const res = await this.services.api.request({url: `/api/v1/articles/${_id}`});
      const item = res.data.result;

      list.push({...item, amount: pcsNum}); // list уже новый, в него можно пушить.
      // Добавляем к сумме.
      sum += item.price * pcsNum;
    }

    this.setState({
      ...this.getState(),
      list,
      sum,
      amount: list.length,
      lock: false,
    }, 'Добавление в корзину завершено');
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
