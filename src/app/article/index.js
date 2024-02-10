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
import useSelector from '@src/hooks/use-selector';
import useServices from '@src/hooks/use-services';

function Article() {
  const store = useStore();
  const services = useServices()
  const {t, lang} = useTranslate();

  // Параметры из пути /articles/:id
  const params = useParams();

  useInit(() => {
    store.actions.article.load(params.id)
  }, [params.id, store, lang]);

  const select = useSelector(state => ({
    article: state.article.data,
    waiting: state.article.waiting,
  }));

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback((_id, itemTitle) => new Promise(
      (res) => store.actions.modals.open({
        type: store.actions.modals.types.amount,
        resolve: res,
        extraData: {
          getTitle: async () => (
            t('amount-dialog.items-amount') + ' ' + (
              await services.api.getItemTitle(_id) || itemTitle
            )
          )
        }
      })
    ).then(amount => {
      if (amount) {
        store.actions.basket.addToBasket(_id, amount)
      }
    }), [store]),
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
