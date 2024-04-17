import { List } from "antd";
import { PaginationConfig } from "antd/es/pagination";
import { memo, useCallback, useMemo } from "react";
import useInit from "../../hooks/use-init";
import useSelector from "../../hooks/use-selector";
import useStore from "../../hooks/use-store";
import { CatalogArticleType } from "../../store/catalog/types";
import CmsLayout from "../cms-layout";
import CmsSider from "../cms-sider";
import TopHead from "../../containers/top-head";

function CMSListPage() {
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
    <CmsLayout>
      <CmsSider/>
      <TopHead />
      <List dataSource={select.articles}
            renderItem={itemRender}
            pagination={paginationConfig}
            size="small"
            loading={select.loading} />
    </CmsLayout>


  )
}

export default memo(CMSListPage);
