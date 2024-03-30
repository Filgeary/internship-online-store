import StoreModule from "../module";
import { TBasketArticle, TBasketState } from "./types";


/**
 * Покупательская корзина
 */
class BasketState extends StoreModule<TBasketState> {

  initState():TBasketState{
    return {
      list: [],
      sum: 0,
      amount: 0,
      active: "",
      waiting:false
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
    const list = this.getState().list.map((item:TBasketArticle) => {
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
      const res = await this.services.api.request({
        url: `/api/v1/articles/${_id}`,
      });
      const item = res.data.result;

      list.push({ ...item, amount: count }); // list уже новый, в него можно пушить.
      // Добавляем к сумме.
      sum += item.price * count;
    }

    this.setState(
      {
        ...this.getState(),
        list,
        sum,
        amount: list.length,
      },
      "Добавление в корзину несколько штук одного товара"
    );
  }

  // мультидобавление в корзину
  async multiAddToBasket(list: any[]) {
    this.setState({
      ...this.getState(),
      waiting: true,
    });

    for (const item of list) {
      await this.addToBasket(item._id);
    }

    this.setState(
      {
        ...this.getState(),
        waiting: false,
      },
      "Добавление в корзину несколько товаров"
    );
  }

  /**
   * Удаление товара из корзины
   * @param _id Код товара
   */
  removeFromBasket(_id: string | number) {
    let sum = 0;
    const list = this.getState().list.filter((item:TBasketArticle) => {
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

  addToActive(_id: string | number) {
    this.setState(
      {
        ...this.getState(),
        active: _id,
      },
      "Установка активного itema"
    );
  }

}

export default BasketState;
