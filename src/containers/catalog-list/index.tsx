import React, {memo, useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import PropTypes from "prop-types";
import {ArticleInterface} from "@src/types/ArticleInterface";

interface Props {
  stateName?: string,
}

const CatalogList: React.FC<Props> = ({stateName = 'catalog'}) => {

  const store = useStore();

  const {t} = useTranslate();

  const select = useSelector((state: any) => ({
    list: state[stateName].list,
    params: state[stateName].params,
    count: state[stateName].count,
    waiting: state[stateName].waiting,
  }));

  const callbacks = {
    addToBasket: useCallback(async (item: ArticleInterface) => {
      const result = await store.actions.modals.open('adding', {...item})
      if (result > 0) {
        store.actions.basket.addToBasket(item._id, result)
      }
    }, []),
    // Пагинация
    onPaginate: useCallback((page: number) => {
      store.actions[stateName].setParams({page})
    }, [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page: number) => {
      return `?${new URLSearchParams({
        page: String(page),
        limit: select.params.limit,
        sort: select.params.sort,
        query: select.params.query
      })}`;
    }, [select.params.limit, select.params.sort, select.params.query])
  }

  const renders = {
    item: useCallback((item: ArticleInterface) =>
        <Item item={item} onAdd={callbacks.addToBasket}
              link={`/articles/${item._id}`} labelAdd={t('article.add')}/>,
      [callbacks.addToBasket, t]),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item}/>
      <Pagination count={select.count} page={select.params.page}
                  limit={select.params.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </Spinner>
  );
}

CatalogList.prototype = {
  stateName: PropTypes.string
}

CatalogList.defaultProps = {
  stateName: 'catalog'
}

export default memo(CatalogList);
