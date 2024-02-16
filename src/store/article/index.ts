import { isSuccessResponse } from '@src/api';
import StoreModule from '../module';

import type { IArticle } from '@src/types/IArticle';

type InitialArticleState = {
  data: IArticle | null;
  waiting: boolean;
};

/**
 * Детальная информация о товаре для страницы товара
 */
class ArticleState extends StoreModule<InitialArticleState> {
  initState(): InitialArticleState {
    return {
      data: null,
      waiting: false,
    };
  }

  async load(id: string) {
    // Сброс текущего товара и установка признака ожидания загрузки
    this.setState({
      data: null,
      waiting: true,
    });

    try {
      const res = await this.services.api.request<IArticle>({
        url: `/api/v1/articles/${id}?fields=*,madeIn(title,code),category(title)`,
      });

      if (isSuccessResponse(res.data)) {
        // Товар загружен успешно
        this.setState(
          {
            data: res.data.result,
            waiting: false,
          },
          'Загружен товар из АПИ',
        );
      }
    } catch (e) {
      // Ошибка при загрузке
      // @todo В стейт можно положить информацию об ошибке
      this.setState({
        data: null,
        waiting: false,
      });
    }
  }
}

export default ArticleState;
