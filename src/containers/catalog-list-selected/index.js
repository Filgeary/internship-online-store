import {memo, useCallback, useState} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import PropTypes from "prop-types";
import ItemSelect from "@src/components/item-select";

function CatalogListSelected({stateName, selectedList, onUpdateSelectedList}) {

  const store = useStore();

  const {t} = useTranslate();
  const select = useSelector(state => ({
    list: state[stateName].list,
    params: state[stateName].params,
    count: state[stateName].count,
    waiting: state[stateName].waiting,
  }));

  const callbacks = {
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({
        page,
        limit: select.params.limit,
        sort: select.params.sort,
        query: select.params.query
      })}`;
    }, [select.params.limit, select.params.sort, select.params.query]),
    // Пагинация
    onPaginate: useCallback(page => {
      store.actions[stateName].setParams({page})
    }, [store]),
    // генератор ссылки для пагинатора
    onSelect: useCallback((_id, quantity, select) => {
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
    item: useCallback(item => {
        return (<ItemSelect item={item} select={selectedList[item._id]} onSelect={callbacks.onSelect}
                    labelAdd={t('article.add')}/>)
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
