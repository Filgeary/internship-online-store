import { useCallback } from "react";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import Pagination from "@src/components/pagination";

export default function Paginator() {
    const store = useStore();

    const select = useSelector((state) => ({
      page: state.catalog.params.page,
      limit: state.catalog.params.limit,
      count: state.catalog.count,
      sort: state.catalog.params.sort,
      query: state.catalog.params.query,
      category: state.catalog.params.category,
    }));

    const callbacks = {
      // Пагинация
      onPaginate: useCallback(
        (page) => store.actions.catalog.setParams({ page }),
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
