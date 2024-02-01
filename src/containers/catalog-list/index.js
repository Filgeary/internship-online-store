import {memo, useCallback, useEffect, useMemo, useState} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import Item from "@src/components/item";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import {useDispatch} from "react-redux";
import modalsActions from "@src/store-redux/modals/actions";
import ModalLayout from "@src/components/modal-layout";
import {useSelector as useSelectorRedux} from "react-redux/es/hooks/useSelector";
import ModalAddBasket from "@src/components/modal-add-basket";
import articleActions from "@src/store-redux/article/actions";
import ItemSelect from "@src/components/item-select";

function CatalogList({setParams, setNewState, state}) {
  const store = useStore();

  const {t} = useTranslate();

  const select = useSelector(state => ({
    list: state.catalog.list,
    params: state.catalog.params,
    count: state.catalog.count,
    waiting: state.catalog.waiting,
  }));

  const [localState, setLocalState] = useState(state || select)


  // При изменении "внешних состояний" будет обновляться "внутренний" state
  useEffect(() => {
    // Если переданы параметры, то кладем их в локальный state, поля полностью идентичны, поэтому все будет работать как и раньше
    if(state) setLocalState(state)
    else setLocalState(select)
  }, [state, select]);

  const callbacks = {
    // Добавление в корзину
    addToBasket: useCallback(async item => {
      const resultInput = await store.actions.modals.open(`adding`, {
        title: item.title,
        price: item.price,
      });
      callbacks.handleSubmit(item._id, resultInput)
    }, [localState]),
    // Выделение товаров по id, а так же их удаления из списка выделенных если они были убраны из выделенных
    onSelect: useCallback((_id, quantity, select) => {
      // Создаем "локальную" копию списка выбранных товаров для дальнейшей работы
      const selectList = {...localState.selectList};
      if (select) {
        // Если товар выбран на данной итерации, то мы или изменяем, или добавляем значение его количества и перезаписываем
        selectList[`${_id}`] = quantity
      } else {
        // Если же товар был удален из списка выбранных то просто удаляем его из "локального" и так же перезаписываем
        delete selectList[`${_id}`]
      }
      setNewState({selectList})

    }, [localState.selectList]),
    // Добавление товара в корзину
    handleSubmit: useCallback((_id, quantity) => {
      if(quantity > 0) {
        store.actions.basket.addToBasket(_id, quantity)
      }
    }, [localState]),
    // Пагинация
    onPaginate: useCallback(page => {
      if (!state){
        store.actions.catalog.setParams({page})
      } else {
        setParams({page})
      }
    }, [store, localState]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({
        page,
        limit: localState.params.limit,
        sort: localState.params.sort,
        query: localState.params.query
      })}`;
    }, [localState.params.limit, localState.params.sort, localState.params.query])
  }

  const renders = {
    item: useCallback(item => {
      return state
        ? <ItemSelect item={item} onSelect={callbacks.onSelect}
                       select={localState.selectList[item._id]}/>
        : <Item item={item} onAdd={callbacks.addToBasket}
                link={`/articles/${item._id}`} labelAdd={t('article.add')}/>;
    }, [callbacks.addToBasket, localState.selectList, t]),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={localState.list} renderItem={renders.item}/>
      <Pagination count={localState.count} page={localState.params.page}
                  limit={localState.params.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </Spinner>
  );
}

export default  memo(CatalogList);
