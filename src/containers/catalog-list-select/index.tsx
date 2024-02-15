import {memo, useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import PropTypes from "prop-types";
import ItemSelect from "@src/components/item-select";
import type { CatalogListSelectProps } from "./types";
import { CatalogItem } from "@src/types";


function CatalogListSelect(props: CatalogListSelectProps) {
  const store = useStore();
  const {t} = useTranslate()

  const select = useSelector(state => ({
    list: state[props.catalogModuleName].list,
    page: state[props.catalogModuleName].params.page,
    limit: state[props.catalogModuleName].params.limit,
    count: state[props.catalogModuleName].count,
    waiting: state[props.catalogModuleName].waiting,
    sort: state[props.catalogModuleName].params.sort,
    query: state[props.catalogModuleName].params.query,
  }));

  const callbacks = {
    // Пагинация
    onPaginate: useCallback((page: number) => store.actions[props.catalogModuleName].setParams({page}), [store]),
    // генератор ссылки для пагинатора
    makePaginatorLink: useCallback((page: number) => {
      return `?${new URLSearchParams({page: String(page), limit: String(select.limit), sort: select.sort, query: select.query})}`;
    }, [select.limit, select.sort, select.query])
  }

  const renders = {
    item: useCallback((item: CatalogItem) => (
      <ItemSelect item={item} onClick={props.toggleSelect} selected={props.selectedItems.includes(item._id)}/>
    ), [t, props.selectedItems]),
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
  catalogModuleName: PropTypes.string
}

CatalogListSelect.defaultProps = {
  selectedItems: [],
  toggleSelect: () => {},
  catalogModuleName: 'catalog'
}

export default memo(CatalogListSelect);
