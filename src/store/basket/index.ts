import StoreModule from "../module";
import type { IBasketItem, IBasketState, IItemReponse } from "./types";

/**
 * Покупательская корзина
 */
class BasketState extends StoreModule<IBasketState> {
  initState(): IBasketState {
    return {
      list: [],
      sum: 0,
      amount: 0,
    }
  }

  /**
   * Добавление товара в корзину
   * @param _id {String} Код товара
   */
  async addToBasket(_id: string, amount: number = 1): Promise<void> {
    let sum = 0;
    this.initState()
    // Ищем товар в корзине, чтобы увеличить его количество
    let exist = false;
    const list = this.getState().list.map((item: IBasketItem) => {
      let result = item;
      if (item._id === _id) {
        exist = true; // Запомним, что был найден в корзине
        result = {...item, amount: item.amount + amount};
      }
      sum += result.price * result.amount;
      return result;
    });

    if (!exist) {
      // Поиск товара в каталоге, чтобы его добавить в корзину.
      const res = await this.services.api.request<IItemReponse>({url: `/api/v1/articles/${_id}`});
      const item = res.data.result;

      list.push({...item, amount}); // list уже новый, в него можно пушить.
      // Добавляем к сумме.
      sum += item.price*amount;
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
   * @param ids [String] Коды товаров
   */
    async addManyToBasket(ids: string[]): Promise<void> {
      /// TODO оптимизировать метод
      // Ищем товары в корзине, чтобы увеличить их количество
      const existed: string[] = [];
      let list = [...this.getState().list]
      ids.forEach(id => {
        const index = list.findIndex(item => item._id === id)
        if (index !== -1) {
          list = [
            ...list.slice(0, index),
            {
              ...list[index],
              amount: list[index].amount + 1
            },
            ...list.slice(index+1, list.length)
          ]
          existed.push(id)
        }
      });

      const notExisted = ids.filter(id => !existed.includes(id))
      if (notExisted.length) {
        // Поиск товара в каталоге, чтобы его добавить в корзину.
        const promises = notExisted.map(id => this.services.api.request<IItemReponse>({url: `/api/v1/articles/${id}`}))
        const items = (await Promise.all(promises)).map(
          (res) => res.data.result
        )
        items.forEach(item => list.push({...item, amount: 1}))
      }

      const sum = list.reduce((acc, item) => acc + item.price*item.amount, 0)
  
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
  removeFromBasket(_id: string): void {
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

  async translateItems(): Promise<void>{
    const state = this.getState()
    const ids = state.list.map((item: IBasketItem) => item._id)
    const promises = ids.map(
      (_id: string) => this.services.api.request<IItemReponse>({url: `/api/v1/articles/${_id}`})
    )
    const titles = (await Promise.all(promises)).map(
      (res) => res.data.result.title
    )
    const list = state.list.map(
      (item: IBasketItem, i: number) =>( {...item, title: titles[i]})
    )
    this.setState({
      ...state,
      list
    }, 'Перевод товаров в корзиине')
  }
}

export default BasketState;
