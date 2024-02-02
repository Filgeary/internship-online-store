import { useCallback, memo } from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import Pagination from "@src/components/pagination";

function Paginator(props) {
    const store = useStore();

    const select = useSelector((state) => ({
      page: state[props.storeName].params.page,
      limit: state[props.storeName].params.limit,
      count: state[props.storeName].count,
      sort: state[props.storeName].params.sort,
      query: state[props.storeName].params.query,
      category: state[props.storeName].params.category,
    }));

    const callbacks = {
      // Пагинация
      onPaginate: useCallback(
        (page) => store.actions[props.storeName].setParams({ page }),
        [store]
      ),
      // генератор ссылки для пагинатора
      makePaginatorLink: useCallback(
        (page) => {
          return `?${new URLSearchParams({
            page,
            limit: select.limit,
            sort: select.sort,
            query: select.query,
            category: select.category,
          })}`;
        },
        [select.limit, select.sort, select.query, select.category]
      ),
    };

    return (
      <Pagination
        count={select.count}
        page={select.page}
        limit={select.limit}
        onChange={callbacks.onPaginate}
        makeLink={callbacks.makePaginatorLink}
      />
    );
}

export default memo(Paginator);
