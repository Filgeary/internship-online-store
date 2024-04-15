import { memo, useCallback, useMemo } from "react";
import useInit from "../../hooks/use-init";
import useStore from "../../hooks/use-store";
import { List } from "antd";
import useSelector from "../../hooks/use-selector";
import { PaginationConfig } from "antd/es/pagination";
import { CatalogArticleType } from "../../store/catalog/types";

function CmsCatalog() {
  const store = useStore();
  useInit(async () => {
      await Promise.all([
        store.actions.catalog.initParams(),
      ]);
    }, [], "catalog initial" ,true);

  const select = useSelector(state => ({
    articles: state.catalog.list,
    totalArticles: state.catalog.count,
    pageSize: state.catalog.params.limit,
    loading: state.catalog.waiting,
  }))

  const callbacks = {
    onPaginate: useCallback((page: number) => store.actions.catalog.setParams({ page }), [store]),
    onSizeChange: useCallback((current: number, size: number) => {
      store.actions.catalog.setParams({page: current, limit: size});
    }, [store])
  }

  const paginationConfig: PaginationConfig = useMemo(() => ({
      position: "top",
      onChange: callbacks.onPaginate,
      onShowSizeChange : callbacks.onSizeChange,
      pageSize: select.pageSize,
      total: select.totalArticles,
      hideOnSinglePage: true,
      size: "small"

    }), [select.pageSize, select.totalArticles, callbacks.onPaginate])

  const itemRender = useCallback((item: CatalogArticleType) => (
    <List.Item>
      <List.Item.Meta title={item.title} description={item.description} />
    </List.Item>
  ), [])

  return (
    <List dataSource={select.articles}
      renderItem={itemRender}
      pagination={paginationConfig}
      size="small"
      loading={select.loading}
    >

    </List>
  )
}

export default memo(CmsCatalog);
