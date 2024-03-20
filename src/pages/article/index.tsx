import React, {memo, useCallback} from 'react';
import {useParams} from "react-router-dom";
import useStore from "@src/shared/hooks/use-store";
import useInit from "@src/shared/hooks/use-init";
import useSelector from "@src/shared/hooks/use-selector";
import useTranslate from "@src/shared/hooks/use-translate";
import PageLayout from "@src/shared/ui/layout/page-layout";
import TopHead from "@src/feature/top-head";
import Head from "@src/shared/ui/layout/head";
import LocaleSelect from "@src/feature/locale-select";
import Navigation from "@src/feature/navigation";
import Spinner from "@src/shared/ui/layout/spinner";
import ArticleCard from "@src/pages/article/components/article-card";

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
