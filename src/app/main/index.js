import {memo, useCallback} from 'react';
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import useInit from "@src/hooks/use-init";
import Navigation from "@src/containers/navigation";
import PageLayout from "@src/components/page-layout";
import Head from "@src/components/head";
import CatalogFilter from "@src/containers/catalog-filter";
import CatalogList from "@src/containers/catalog-list";
import LocaleSelect from "@src/containers/locale-select";
import TopHead from "@src/containers/top-head";
import useModal from '@src/hooks/use-modal';

function Main() {

  const store = useStore();
  const modal = useModal();

  useInit(async () => {
    await Promise.all([
      store.actions.catalog.initParams(),
      store.actions.categories.load()
    ]);
  }, [], true);

  const {t} = useTranslate();

  const callbacks = {
    selectItems: useCallback(() => new Promise((res) => modal.open({
        type: modal.types.selectItems,
        resolve: res
      })).then(ids => {
        if (ids?.length) {
          console.log(ids)
        }
      })
    ),

    openPageModal: useCallback(() => modal.open({
      type: modal.types.page,
      extraData: {
        title: 'Тест модалки со страницей'
      }
    }), [])
  }

  return (
    <PageLayout>
      <TopHead/>
      <Head title={t('title')}>
        <LocaleSelect/>
      </Head>
      <Navigation/>
      <CatalogFilter/>
      <CatalogList/>
    </PageLayout>
  );
}

export default memo(Main);
