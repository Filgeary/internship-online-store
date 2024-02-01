import {memo, useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import PropTypes from "prop-types";
import ItemSelect from "@src/components/item-select";


function CatalogListSelect(props) {
  const store = useStore();

  const select = useSelector(state => ({
    list: state[props.catalogSliceName].list,
    page: state[props.catalogSliceName].params.page,
    limit: state[props.catalogSliceName].params.limit,
    count: state[props.catalogSliceName].count,
    waiting: state[props.catalogSliceName].waiting,
  }));

  const callbacks = {
    // Пагинация
    onPaginate: useCallback(page => store.actions[props.catalogSliceName].setParams({page}), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page) => {
      return `?${new URLSearchParams({page, limit: select.limit, sort: select.sort, query: select.query})}`;
    }, [select.limit, select.sort, select.query])
  }

  const {t} = useTranslate();

  const renders = {
    item: useCallback(item => (
      <ItemSelect item={item} onClick={props.toggleSelect} selected={props.selectedItems.includes(item._id)}/>
    ), [callbacks.addToBasket, t, props.selectedItems]),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item}/>
      <Pagination count={select.count} page={select.page} limit={select.limit}
                  onChange={callbacks.onPaginate} makeLink={callbacks.makePaginatorLink}/>
    </Spinner>
  );
}

CatalogListSelect.propTypes = {
  selectedItems: PropTypes.array,
  toggleSelect: PropTypes.func,
  catalogSliceName: PropTypes.string
}

CatalogListSelect.defaultProps = {
  selectedItems: [],
  toggleSelect: () => {},
  catalogSliceName: 'catalog'
}

export default memo(CatalogListSelect);
