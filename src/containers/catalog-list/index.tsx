import {memo, useCallback } from "react";
import useStore from "../../hooks/use-store";
import useSelector from "../../hooks/use-selector";
import useTranslate from "../../hooks/use-translate";
import Item from "../../components/item";
import List from "../../components/list";
import Spinner from "../../components/spinner";
import ItemModalCatalog from "../../components/item-modal-catalog";
import { CatalogArticleType } from '../../store/catalog/types';
import { ExtendedModulesKeys, ModulesKeys } from "../../store/types";
import Pagination from "../../components/pagination";

type CatalogListType<T> = {
  isModal?: boolean;
  storeSlice?: ExtendedModulesKeys<T extends ModulesKeys ? T : "catalog">;
  onAdd?: (value: string) => void;
  selectedArticles?: string[];
}

function CatalogList({
    storeSlice = 'catalog',
    isModal = false,
    onAdd,
    selectedArticles,
  }: CatalogListType<'catalog'>) {
  const store = useStore();

  const select = useSelector(state => ({
    list: state[storeSlice].list,
    page: state[storeSlice].params.page,
    limit: state[storeSlice].params.limit,
    sort: state[storeSlice].params.sort,
    query: state[storeSlice].params.query,
    category: state[storeSlice].params.category,
    madeIn: state[storeSlice].params.madeIn,
    count: state[storeSlice].count,
    waiting: state[storeSlice].waiting,
  }));

  const callbacks = {
    // Добавление в корзину
    arcticleCount: useCallback((_id: string, _title: string) => {
      store.actions.modals.open("addToBasket", {title: _title, count: 1})
        .then( result => {
          if(result) {
            store.actions.basket.addToBasket(_id, result)
          }
        });
    }, [store]),
    // Пагинация
    onPaginate: useCallback((page: number) => store.actions[storeSlice].setParams({ page }), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page: number) => {
      //@ts-ignore
      return `?${new URLSearchParams({page,
                                      limit: select.limit,
                                      sort: select.sort,
                                      query: select.query,
                                      category: select.category,
                                      madeIn: select.madeIn,
                                    })}`;
    }, [select.limit, select.sort, select.query, select.category, select.madeIn])
  }

  const {t} = useTranslate();

  const renders = {
    item: useCallback((item: CatalogArticleType) => (
      <Item item={item} onAdd={callbacks.arcticleCount} link={`/articles/${item._id}`} labelAdd={t('article.add')}/>
    ), [callbacks.arcticleCount, t]),
    modalItem: useCallback((item: CatalogArticleType) => (
      <ItemModalCatalog item={item} onAdd={onAdd} selected={!!selectedArticles.find(id => item._id === id)}/>
    ), [t, onAdd])
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={isModal ? renders.modalItem : renders.item}/>
      <Pagination count={select.count} page={select.page} limit={select.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </Spinner>
  );
}

export default memo(CatalogList);
