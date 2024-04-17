import StoreModule from "../module";
import { ArticleDTOType, CmsArticleStateType } from "./types";

/**
 * Детальная ифнормация о товаре для страницы товара
 */
class CmsArticleState extends StoreModule<CmsArticleStateType> {

  waiting: boolean;

  initState(): CmsArticleStateType {
    return {
      waiting: false // признак ожидания загрузки
    }
  }

  // Создание нового товара
  async createArticle(data: ArticleDTOType) {
    this.setState({
      ...this.getState(),
      waiting: true
    })

    try {
      const res = await this.services.api.request({
        url: `/api/v1/articles`,
        method: "POST",
        body: JSON.stringify(data)
      })
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({
        ...this.getState(),
        waiting: false
      })
    }
  }

  // Изменение товара
  async updateArticle(data: ArticleDTOType) {
    this.setState({
      ...this.getState(),
      waiting: true
    })

    try {
      const res = await this.services.api.request({
        url: `/api/v1/articles/${data._id}`,
        method: "PUT",
        body: JSON.stringify(data)
      })
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({
        ...this.getState(),
        waiting: false
      })
    }
  }

  // удаление товара
  async deleteArticle(id: string) {
    this.setState({
      ...this.getState(),
      waiting: true
    })

    try {
      const res = await this.services.api.request({
        url: `/api/v1/articles/${id}`,
        method: "DELETE",
      })
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({
        ...this.getState(),
        waiting: false
      })
    }
  }

}

export default CmsArticleState;
