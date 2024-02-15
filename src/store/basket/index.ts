import { isSuccessResponse } from "@src/api";
import StoreModule from "../module";

import type { IArticle } from "@src/types/IArticle";

type ExtendedArticle = IArticle & { amount: number };

type InitialBasketState = {
  list: ExtendedArticle[];
  sum: number;
  amount: number;
};

/**
 * Покупательская корзина
 */
class BasketState extends StoreModule<InitialBasketState> {
  initState(): InitialBasketState {
    return {
      list: [],
      sum: 0,
      amount: 0,
    };
  }

  async addToBasket(_id: string, amount: number) {
    if (!amount || !Number.isFinite(amount) || amount <= 0) return;

    let sum = 0;
    // Ищем товар в корзине, чтобы увеличить его количество
    let exist = false;
    const list = this.getState().list.map((item) => {
      let result = item;
      if (item._id === _id) {
        exist = true; // Запомним, что был найден в корзине
        result = { ...item, amount: item.amount + Number(amount) };
      }
      sum += result.price * result.amount;
      return result;
    });

    if (!exist) {
      // Поиск товара в каталоге, чтобы его добавить в корзину.
      const res = await this.services.api.request<IArticle>({
        url: `/api/v1/articles/${_id}`,
      });

      if (isSuccessResponse(res.data)) {
        const item = res.data.result;
        list.push({ ...item, amount: Number(amount) }); // list уже новый, в него можно пушить.
        // Добавляем к сумме.
        sum += item.price * amount;
      }
    }

    this.setState(
      {
        ...this.getState(),
        list,
        sum,
        amount: list.length,
      },
      "Добавление в корзину"
    );
  }

  removeFromBasket(_id: string) {
    let sum = 0;
    const list = this.getState().list.filter((item) => {
      if (item._id === _id) return false;
      sum += item.price * item.amount;
      return true;
    });

    this.setState(
      {
        ...this.getState(),
        list,
        sum,
        amount: list.length,
      },
      "Удаление из корзины"
    );
  }
}

export default BasketState;
