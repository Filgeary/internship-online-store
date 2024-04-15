import { memo, useCallback, useMemo, useState } from "react";
import useInit from "../../hooks/use-init";
import useStore from "../../hooks/use-store";
import { Drawer, TablePaginationConfig } from "antd";
import useSelector from "../../hooks/use-selector";
import CmsTableLayout from "../../components/cms-table-layout";
import tableCatalogDataFormat, { TableArticleType } from "../../utils/cms/table-data-format";
import { SorterResult } from "antd/es/table/interface";
import Spinner from "../../components/spinner";
import ArticleCard from "../../components/article-card";
import useTranslate from "../../hooks/use-translate";
import Title from "antd/es/typography/Title";

function CmsCatalogTable() {
  const [isOpen, setIsOpen] = useState(false)

  const store = useStore();
  useInit(async () => {
      await Promise.all([
        store.actions.catalog.initParams(),
        store.actions.categories.load()
      ]);
  }, [], "cms initial" ,true);

  const {t} = useTranslate();

  const select = useSelector(state => ({
    articles: state.catalog.list,
    totalArticles: state.catalog.count,
    pageSize: state.catalog.params.limit,
    loadingCatalog: state.catalog.waiting,
    loadingCategories: state.categories.waiting,
    categories: state.categories.list,
    loadingArticle: state.article.waiting,
    article: state.article.data
  }))

  const callbacks = {
    onPaginate: useCallback((page: number) => store.actions.catalog.setParams({ page }), [store]),
    onSizeChange: useCallback((current: number, size: number) => {
      store.actions.catalog.setParams({page: current, limit: size});
    }, [store]),
    onSearch: useCallback((query: string) => store.actions.catalog.setParams({query, page: 1}), [store]),
    sort: (s: SorterResult<TableArticleType>) => {
      let sort = ""
      switch (s.columnKey) {
        case "price":
          sort = s.order === "ascend" ? 'price' : '-price';
          if(s.order === undefined)
              sort = "";
          break
        default:
          return;
      }
      console.log(sort)
      store.actions.catalog.setParams({sort});
    },
    openDrawer: useCallback((id: string) => {
      setIsOpen(true);
      store.actions.article.load(id);
    }, [store])
  }

  const paginationConfig: TablePaginationConfig = useMemo(() => ({
      position: ["topRight"],
      onChange: callbacks.onPaginate,
      onShowSizeChange : callbacks.onSizeChange,
      pageSize: select.pageSize,
      total: select.totalArticles,
      hideOnSinglePage: false,
      size: "small"

    }), [select.pageSize, select.totalArticles, callbacks.onPaginate, callbacks.onSizeChange])

  const tableData = tableCatalogDataFormat(select.articles, select.categories);

  return (
    <>
      <CmsTableLayout data={tableData}
                  paginationConfig={paginationConfig}
                  loading={select.loadingCatalog || select.loadingCategories}
                  onSorting={callbacks.sort}
                  drawerDetails={callbacks.openDrawer}
                  onFiltering={callbacks.onSearch}
      />
      <Drawer open={isOpen} onClose={() => setIsOpen(false)} size="large">
        <Spinner active={select.loadingArticle}>
          <Title style={{paddingLeft: "40px"}}>{select.article?.title}</Title>
          <ArticleCard article={select.article} onAdd={() => {}} t={t}/>
        </Spinner>
      </Drawer>
    </>

  )
}

export default memo(CmsCatalogTable);
