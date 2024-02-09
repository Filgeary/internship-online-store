import { ResponseData } from "../article/type";
import StoreModule from "../module";
import type { InitialStateBasket } from "./type";

/**
 * Покупательская корзина
 */
class BasketState extends StoreModule<"basket"> {
  initState(): InitialStateBasket {
    return {
      list: [],
      sum: 0,
      amount: 0,
      waiting: false,
    };
  }

  /**
   * Добавление товара в корзину
   * @param _id {String} Код товара
   */
  async addToBasket(_id: string, count = 1) {
    let sum = 0;
    // Ищем товар в корзине, чтобы увеличить его количество
    let exist = false;
    const list = this.getState().list.map((item: any) => {
      let result = item;
      if (item._id === _id) {
        exist = true; // Запомним, что был найден в корзине
        result = { ...item, amount: item.amount + count };
      }
      sum += result.price * result.amount;
      return result;
    });

    if (!exist) {
      // Поиск товара в каталоге, чтобы его добавить в корзину.
      const res = await this.services.api.request<ResponseData>({
        url: `/api/v1/articles/${_id}`,
      });

      if(res.status === 200) {
        const item = res.data.result;

        list.push({ ...item, amount: count }); // list уже новый, в него можно пушить.
        // Добавляем к сумме.
        sum += item.price * count;
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

  /**
   * Добавление нескольких товаров
   * @param arr Массив с кодами товаров
   */

  async addManyToBasket(items: string[]) {
    this.setState({ ...this.getState(), waiting: true });

    for (const item of items) {
      await this.addToBasket(item);
    }

    this.setState({ ...this.getState(), waiting: false });
  }

  /**
   * Удаление товара из корзины
   * @param _id Код товара
   */
  removeFromBasket(_id: string) {
    let sum = 0;
    const list = this.getState().list.filter((item: any) => {
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
