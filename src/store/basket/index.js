import StoreModule from "../module";

/**
 * Покупательская корзина
 */
class BasketState extends StoreModule {

  initState() {
    return {
      list: [],
      sum: 0,
      amount: 0
    }
  }

  /**
   * Добавление товара в корзину
   * @param _id {String} Код товара
   * @param quantity {Number} Количество товара
   */
  async addToBasket(_id, quantity = 1) {

    let sum = 0;
    // Ищем товар в корзине, чтобы увеличить его количество
    let exist = false;
    const list = this.getState().list.map(item => {
      let result = item;
      if (item._id === _id) {
        exist = true; // Запомним, что был найден в корзине
        result = {...item, amount: item.amount + quantity};
      }
      sum += result.price * result.amount;
      return result;
    });

    if (!exist) {
      // Поиск товара в каталоге, чтобы его добавить в корзину.
      const res = await this.services.api.request({url: `/api/v1/articles/${_id}`});
      const item = res.data.result;
      list.push({...item, amount: quantity}); // list уже новый, в него можно пушить.
      // Добавляем к сумме.
      sum += item.price * quantity;
    }

    this.setState({
      ...this.getState(),
      list,
      sum,
      amount: list.length
    }, 'Добавление в корзину');
  }

  /**
   * Добавление списка товаров
   * @param listArticles {Object} - Список товаров, где ключ это id товара, а значение количество
   */
  async addListArticle(listArticles = {}) {
    // Создаем сумму
    let sum = 0;

    // Перебор массива с уже созданными элементами и если такой элемент есть в списке выбранных, то мы перезаписываем его количество и пересчитываем сумму
    const list = this.getState().list.map(item => {
      let result = item;
      if (listArticles[item._id]) {
        result = {...item, amount: item.amount + listArticles[item._id]};
        // Удаляем значение из списка
        delete listArticles[item._id]
      }
      sum += result.price * result.amount;
      return result;
    })

    // Если в списке остались какие-либо товары, то по ключам через "|" запрашиваем эти товары
    if(Object.keys(listArticles).length > 0) {
      const resName = Object.keys(listArticles).join('|')
      const res = await this.services.api.request({url: `/api/v1/articles?search%5Bids%5D=${resName}&fields=*`})
      // После пересчитываем значение и количество, а так же изменяем сумму
      res.data.result.items.forEach(item => {
        list.push({...item, amount: listArticles[item._id]})
        sum += item.price * listArticles[item._id];
      })
    }

    // Перезаписываем стэйт
    this.setState({
      ...this.getState(),
      list,
      sum,
      amount: list.length
    }, 'Добавление в корзину списка товаров');
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
