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
      active: "",
      articleCount: 0,
    };
  }

  /**
   * Добавление товара в корзину
   * @param _id {String} Код товара
   */
  async addToBasket(_id, count = 1) {
    let sum = 0;
    // Ищем товар в корзине, чтобы увеличить его количество
    let exist = false;
    const list = this.getState().list.map((item) => {
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
      "Добавление в корзину"
    );
  }


  // мультидобавление в корзину
  async multiAddToBasket(list) {
    this.setState({
      ...this.getState(),
      waiting: true,
    });

    for (const item of list) {
      await this.addToBasket(item.id);
    }
    
    this.setState({
      ...this.getState(),
      waiting: false,
    });
  }

  /**
   * Удаление товара из корзины
   * @param _id Код товара
   */
  removeFromBasket(_id) {
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

  addToActive(_id) {
    this.setState(
      {
        ...this.getState(),
        active: _id,
      },
      "Установка активного itema"
    );
  }

  /* removeFromActive() {
    this.setState(
      {
        ...this.getState(),
        active: "",
      },
      "Удаление активного itema"
    );
  } */

  addToArticleCount(count) {
    this.setState(
      {
        ...this.getState(),
        articleCount: parseInt(count),
      },
      "Установка количества товара"
    );
  }
}

export default BasketState;
