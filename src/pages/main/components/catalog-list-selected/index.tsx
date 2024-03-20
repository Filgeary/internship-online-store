import React, {memo, useCallback} from "react";
import {ExtendedModulesKey} from "@src/shared/store/types";
import useStore from "@src/shared/hooks/use-store";
import useTranslate from "@src/shared/hooks/use-translate";
import useSelector from "@src/shared/hooks/use-selector";
import ItemSelect from "@src/shared/ui/elements/item-select";
import List from "@src/shared/ui/elements/list";
import Pagination from "@src/widgets/pagination";

interface Props {
  stateName: ExtendedModulesKey<'catalog'>,
  selectedList: Record<string, number>,
  onUpdateSelectedList: (obj: object) => void
}

const CatalogListSelected: React.FC<Props> = ({stateName = 'catalog', selectedList, onUpdateSelectedList}) => {

  const store = useStore();

  const {t}: any = useTranslate();

  const select = useSelector(state => ({
    list: state[stateName].list,
    params: state[stateName].params,
    count: state[stateName].count,
    waiting: state[stateName].waiting,
  }));

  const callbacks = {
    makePaginatorLink: useCallback((page: number) => {
      return `?${new URLSearchParams({
        limit: String(select.params.limit),
        page: String(page),
        query: select.params.query,
        sort: select.params.sort
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
    item: useCallback((item: IArticle) => {
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
export default memo(CatalogListSelected);
