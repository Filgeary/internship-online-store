import StoreModule from "../module";
import { Article, IArticleState } from "./types";

/**
 * Детальная ифнормация о товаре для страницы товара
 */
class ArticleState extends StoreModule {
  initState(): IArticleState {
    return {
      data: {} as Article,
      waiting: false, // признак ожидания загрузки
    };
  }

  async load(id: string) {
    // Сброс текущего товара и установка признака ожидания загрузки
    this.setState({
      data: {} as Article,
      waiting: true,
    });

    try {
      const res = await this.services.api.request({
        url: `/api/v1/articles/${id}?fields=*,madeIn(title,code),category(title)`,
      });

      // Товар загружен успешно
      this.setState(
        {
          data: res.data.result as Article,
          waiting: false,
        },
        "Загружен товар из АПИ"
      );
    } catch (e) {
      // Ошибка при загрузке
      // @todo В стейт можно положить информацию об ошибке
      this.setState({
        data: {} as Article,
        waiting: false,
      });
    }
  }
}

export default ArticleState;
