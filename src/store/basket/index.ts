import StoreModule from "../module";
import { BasketItemType, BasketStateType } from "./types";

/**
 * Покупательская корзина
 */
class BasketState extends StoreModule<BasketStateType> {
  list: BasketItemType[];
  sum: number;
  amount: number;

  initState(): BasketStateType {
    return {
      list: [],
      sum: 0,
      amount: 0
    }
  }

  /**
   * Добавление товара в корзину
   * @param _id {String} Код товара
   * @param _count {Number} Количество товара
   */
  async addToBasket(_id: string, _count: number = 1): Promise<void> {
    let sum = 0;
    // Ищем товар в корзине, чтобы увеличить его количество
    let exist = false;
    const list: BasketItemType[] = this.getState().list.map((item: BasketItemType) => {
      let result = item;
      if (item._id === _id) {
        exist = true; // Запомним, что был найден в корзине
        result = {...item, amount: item.amount + _count};
      }
      sum += result.price * result.amount;
      return result;
    });

    if (!exist) {
      // Поиск товара в каталоге, чтобы его добавить в корзину.
      const res = await this.services.api.request({url: `/api/v1/articles/${_id}`});
      const item = res.data.result;

      list.push({...item, amount: _count}); // list уже новый, в него можно пушить.
      // Добавляем к сумме.
      sum += item.price * _count;
    }

    this.setState({
      ...this.getState(),
      list,
      sum,
      amount: list.length
    }, 'Добавление в корзину');
  }

  /**
   * Удаление товара из корзины
   * @param _id Код товара
   */
  removeFromBasket(_id: string | number): void {
    let sum = 0;
    const list: BasketItemType[] = this.getState().list.filter((item: BasketItemType) => {
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
