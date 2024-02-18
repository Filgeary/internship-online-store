import StoreModule from "../module";
import { IArticle, IArticleState } from "./types";

/**
 * Детальная ифнормация о товаре для страницы товара
 */
class ArticleState extends StoreModule<IArticleState> {
  initState(): IArticleState {
    return {
      data: {} as IArticle,
      waiting: false, // признак ожидания загрузки
    };
  }

  async load(id: string) {
    // Сброс текущего товара и установка признака ожидания загрузки
    this.setState({
      data: {} as IArticle,
      waiting: true,
    });

    try {
      const res = await this.services.api.request({
        url: `/api/v1/articles/${id}?fields=*,madeIn(title,code),category(title)`,
      });

      // Товар загружен успешно
      this.setState(
        {
          data: res.data.result as IArticle,
          waiting: false,
        },
        "Загружен товар из АПИ"
      );
    } catch (e) {
      // Ошибка при загрузке
      // @todo В стейт можно положить информацию об ошибке
      this.setState({
        data: {} as IArticle,
        waiting: false,
      });
    }
  }
}

export default ArticleState;
