import {memo, useCallback} from 'react';
import {useParams} from "react-router-dom";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import useInit from "@src/hooks/use-init";
import PageLayout from "@src/components/page-layout";
import Head from "@src/components/head";
import Navigation from "@src/containers/navigation";
import Spinner from "@src/components/spinner";
import ArticleCard from "@src/components/article-card";
import LocaleSelect from "@src/containers/locale-select";
import TopHead from "@src/containers/top-head";
import useSelector from "@src/hooks/use-selector";

function Article() {
    const store = useStore();

    // Параметры из пути /articles/:id
    const params = useParams();

    useInit(() => {
        store.actions.article.load(params.id ? params.id : '646b6e1fe1626c0bd8518064');
    }, [params.id]);

    const select = useSelector(state => ({
        article: state.article.data,
        waiting: state.article.waiting
    }))

    const {t} = useTranslate();

    const callbacks = {
        // Добавление в корзину
        addToBasket: useCallback(async (_id: number | string) => {
            // Я посчитал логичным, что модальное окно по добавлению товара будет вызываться со страницы товара
            const result: number = await store.actions.modals.open(`adding`, {
                _id: select.article._id,
                title: select.article.title,
                price: select.article.price,
            }) as number
            await store.actions.basket.addToBasket(_id, result)
        }, [select.article, store]),
    }
    return (
        <PageLayout>
            <TopHead/>
            <Head title={select.article.title}>
                <LocaleSelect/>
            </Head>
            <Navigation/>
            <Spinner active={select.waiting}>
                <ArticleCard article={select.article} onAdd={callbacks.addToBasket} t={t}/>
            </Spinner>
        </PageLayout>
    );
}

export default memo(Article);
