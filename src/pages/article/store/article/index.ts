import StoreModule from "@src/shared/services/store/module";
import {TArticleState} from "@src/pages/article/store/article/types";

/**
 * Детальная информация о товаре для страницы товара
 */
class ArticleState extends StoreModule<TArticleState> {
    initState(): TArticleState {
        return {
            data: {} as IArticle,
            waiting: false, // признак ожидания загрузки
            error: ''
        }
    }

    /**
     * Загрузка товаров по id
     * @param id {String}
     * @return {Promise<void>}
     */
    async load(id: string | number): Promise<void> {
        // Сброс текущего товара и установка признака ожидания загрузки
        this.setState({
            data: {} as IArticle,
            waiting: true,
            error: ''
        });
        const res = await this.services.api.request({
            url: `/api/v1/articles/${id}?fields=*,madeIn(title,code),category(title)`
        });
        if (res.status === 200) {
            // Товар загружен успешно
            this.setState({
                data: res.data.result,
                waiting: false,
                error: ''
            }, 'Загружен товар из АПИ');
        }
        if (res.status === 400) {
            this.setState({
                data: {} as IArticle,
                waiting: false,
                error: res.data.error.message
            });
        }
    }
}

export default ArticleState;
