import StoreModule from "../module";
import type { ResponseData, InitialStateArticle } from "./type";

/**
 * Детальная ифнормация о товаре для страницы товара
 */
class ArticleState extends StoreModule {

  initState(): InitialStateArticle {
    return {
      data: {},
      waiting: false // признак ожидания загрузки
    }
  }

  /**
   * Загрузка товаров по id
   * @param id {String}
   * @return {Promise<void>}
   */
  async load(id: string): Promise<void> {
    // Сброс текущего товара и установка признака ожидания загрузки
    this.setState({
      data: {},
      waiting: true
    });

    try {
      const res = await this.services.api.request<ResponseData>({
        url: `/api/v1/articles/${id}?fields=*,madeIn(title,code),category(title)`
      });

      if(res.status === 200) {
        // Товар загружен успешно
        this.setState({
          data: res.data.result,
          waiting: false
        }, 'Загружен товар из АПИ');
      }

    } catch (e) {
      // Ошибка при загрузке
      // @todo В стейт можно положить информацию об ошибке
      this.setState({
        data: {},
        waiting: false
      });
    }
  }
}

export default ArticleState;
