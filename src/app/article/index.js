import {memo, useCallback, useMemo} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import shallowequal from "shallowequal";
import articleActions from '@src/store-redux/article/actions';
import modalsActions from "@src/store-redux/modals/actions";

function Article() {
  const store = useStore();

  const dispatch = useDispatch();
  // Параметры из пути /articles/:id

  const params = useParams();

  useInit(() => {
    //store.actions.article.load(params.id);
    dispatch(articleActions.load(params.id));
  }, [params.id]);

  const select = useSelector(state => ({
    article: state.article.data,
    waiting: state.article.waiting,
  }), shallowequal); // Нужно указать функцию для сравнения свойства объекта, так как хуком вернули объект

  const {t} = useTranslate();

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(_id => {
      // Я посчитал логичным, что модальное окно по добавлению товара будет вызываться со страницы товара
      dispatch(modalsActions.open(`adding`, {
        _id: select.article._id,
        title: select.article.title,
        price: select.article.price,
        handleSubmit: callbacks.handleSubmit,
      }));
    }, [select.article, store]),
    // Добавление товара в корзину
    handleSubmit: useCallback((_id, quantity) => {
      if(quantity > 0) {
        store.actions.basket.addToBasket(_id, quantity)
        dispatch(modalsActions.close())
      } else {
        alert('Введите число больше нуля')
      }
    }, []),
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
