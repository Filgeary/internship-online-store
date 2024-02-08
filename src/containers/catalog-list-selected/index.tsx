import React, {memo, useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import PropTypes from "prop-types";
import ItemSelect from "@src/components/item-select";
import {ArticleInterface} from "@src/types/ArticleInterface";

interface Props {
  stateName: string,
  selectedList: any,
  onUpdateSelectedList: (obj: object) => void
}

const CatalogListSelected: React.FC<Props> = ({stateName = 'catalog', selectedList, onUpdateSelectedList}) => {

  const store = useStore();

  const {t}: any = useTranslate();

  const select = useSelector((state: any) => ({
    list: state[stateName].list,
    params: state[stateName].params,
    count: state[stateName].count,
    waiting: state[stateName].waiting,
  }));

  const callbacks = {
    makePaginatorLink: useCallback((page: number) => {
      return `?${new URLSearchParams({
        page: String(page),
        limit: select.params.limit,
        sort: select.params.sort,
        query: select.params.query
      })}`;
    }, [select.params.limit, select.params.sort, select.params.query]),
    // Пагинация
    onPaginate: useCallback((page: number) => {
      store.actions[stateName].setParams({page})
    }, [store]),
    // генератор ссылки для пагинатора
    onSelect: useCallback((_id: string | number, quantity: number, select: boolean) => {
      // Создаем "локальную" копию списка выбранных товаров для дальнейшей работы
      const selectList = {...selectedList};
      if (select) {
        // Если товар выбран на данной итерации, то мы или изменяем, или добавляем значение его количества и перезаписываем
        selectList[_id] = quantity
      } else {
        // Если же товар был удален из списка выбранных, то просто удаляем его из "локального" и так же перезаписываем
        delete selectList[_id]
      }
      onUpdateSelectedList({...selectList})
    }, [selectedList, onUpdateSelectedList])
  }

  const renders = {
    item: useCallback((item: ArticleInterface) => {
        return <ItemSelect item={item} select={selectedList[item._id]} onSelect={callbacks.onSelect}
                    labelAdd={t('article.add')}/>
      },
      [selectedList, callbacks.onSelect, t]),
  };

  return (
    <>
      <List list={select.list} renderItem={renders.item}/>
      <Pagination count={select.count} page={select.params?.page}
                  limit={select.params?.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </>
  );
}

CatalogListSelected.prototype = {
  stateName: PropTypes.string
}

CatalogListSelected.defaultProps = {
  stateName: 'catalog'
}

export default memo(CatalogListSelected);
