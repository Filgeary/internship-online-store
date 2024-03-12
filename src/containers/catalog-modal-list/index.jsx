import {memo, useCallback} from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import useTranslate from "@src/hooks/use-translate";
import ItemCatalogModal from "@src/components/item-catalog-modal";
import List from "@src/components/list";
import Pagination from "@src/components/pagination";
import Spinner from "@src/components/spinner";
import PropTypes from 'prop-types';

function CatalogModalList({ stateName, onSelectItem, selectedItems }) {
  const store = useStore();

  const select = useSelector(state => ({
    list: state[stateName].list,
    page: state[stateName].params.page,
    limit: state[stateName].params.limit,
    count: state[stateName].count,
    waiting: state[stateName].waiting,
  }));

  const callbacks = {
    onPaginate: useCallback(page => store.actions[stateName].setParams({page}), [store]),
  }

  const {t} = useTranslate();

  const renders = {
    item: useCallback(item => (
      <ItemCatalogModal item={item} onSelect={onSelectItem} isSelected={selectedItems.includes(item._id)}/>
    ), [callbacks.onSelectItem, selectedItems, t]),
  };

  return (
    <Spinner active={select.waiting}>
      <List list={select.list} renderItem={renders.item}/>
      <Pagination count={select.count} page={select.page} limit={select.limit}
                  onChange={callbacks.onPaginate}/>
    </Spinner>
  );
}

CatalogModalList.propTypes = {
  stateName: PropTypes.string,
  selectedItems: PropTypes.array,
  onSelectItem: PropTypes.func,
}

CatalogModalList.defaultProps = {
  selectedItems: [],
  onSelectItem: (_id) => {}
}

export default memo(CatalogModalList);
