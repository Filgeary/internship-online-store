import StoreModule from "../module";
import { IBasketInitState } from "./types";

/**
 * Покупательская корзина
 */
class BasketState extends StoreModule {

  initState(): IBasketInitState {
    return {
      list: [],
      sum: 0,
      amount: 0,
      lock: false,
    }
  }

  /**
   * Добавление товара/ов в корзину
   * @param items {Array|Object} Объект или массив объектов вида [{_id, pcs},]
   */
  async addToBasket(items) {
    const itemsArray = items instanceof Array ? items : [items];

    // Нужно, чтобы предотвратить потерю данных, если добавляем в корзину в момент,
    // когда ещё не завершена предыдущая операция добавления (ожидается ответ от сервера)
    let lock = this.getState().lock;
    let i = 0;
    while (lock && i < 1000) {
      await new Promise(resolve => setTimeout(() => resolve(null), 100));
      lock = this.getState().lock;
      i++;
    }

    this.setState({
      ...this.getState(),
      lock: true,
    }, 'Начинаем добавление в корзину');

    // Итемы, которые запросим с сервера в одном запросе
    const notExistInBasket: Record<string, unknown>[] = [];

    let list = this.getState().list;
    let sum = 0;

    for (const {_id, pcs} of itemsArray) {
      const pcsNum = Number(pcs);

      // Ищем товар в корзине, чтобы увеличить его количество
      let exist = false;
      list = list.map(item => {
        let result = item;
        if (item._id === _id) {
          exist = true; // Запомним, что был найден в корзине
          result = {...item, amount: item.amount + pcsNum};
        }
        sum += result.price * result.amount;
        return result;
      });
      // Если итем не был найден, добавим в массив для массового запроса на сервер
      if (!exist) notExistInBasket.push({ _id, pcs });
    }

    if (notExistInBasket.length > 0) {

      // нам нужен запрос такого вида:
      // ...articles?search[ids]=65817bed5c295a2ff2fcd180,65817bed5c295a2ff2fcd181

      // Сформируем строку айдишников через запятую
      const idsString = notExistInBasket.map(({_id}) => _id).join();

      // Поиск товаров в каталоге, чтобы добавить их в корзину.
      const res = await this.services.api.request({ url: `/api/v1/articles?search[ids]=${idsString}` });
      // const res = await this.services.api.request({url: `/api/v1/articles/${_id}`});

      const itemsArray = res.data.result.items;

      for (const item of itemsArray) {
        const pcsNum = Number(notExistInBasket.find(({_id}) => _id === item._id)?.pcs)

        list.push({...item, amount: pcsNum}); // list уже новый, в него можно пушить.
        // Добавляем к сумме.
        sum += item.price * pcsNum;
      }
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
