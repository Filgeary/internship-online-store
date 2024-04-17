import { TablePaginationConfig, Drawer, Space, Button } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { useState, useCallback, useMemo, memo } from "react";
import ArticleCard from "../../../components/article-card";
import CmsTableLayout from "../cms-table-layout";
import Spinner from "../../../components/spinner";
import useInit from "../../../hooks/use-init";
import useStore from "../../../hooks/use-store";
import useTranslate from "../../../hooks/use-translate";
import tableCatalogDataFormat, { TableArticleType } from "../../../utils/cms/table-data-format";
import useSelector from "../../../hooks/use-selector";
import Title from "antd/es/typography/Title";
import CmsLayout from "../../cms-layout";
import CmsSider from "../../cms-sider";
import TopHead from "../../../containers/top-head";
import { PlusOutlined } from "@ant-design/icons";

function CmsCatalog() {
  const [isOpen, setIsOpen] = useState(false)

  const store = useStore();
  useInit(async () => {
      await Promise.all([
        store.actions.catalog.initParams(),
        store.actions.categories.load(),
        store.actions.countries.load(),
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
    }, [store]),
    openEditModal: useCallback((id: string) =>
      store.actions.modals.open("cmsArticleModal", id)
        .then(res => res && store.actions.catalog.setParams())
    , [store]),
    openAddModal: useCallback(() =>
      store.actions.modals.open("cmsArticleModal")
        .then(res=> res && store.actions.catalog.setParams())
    ,[store]),
    deleteArticle: useCallback((id: string) =>{
        const pr = store.actions.cmsArticle.deleteArticle(id);
        pr.then(_=> store.actions.catalog.setParams());

        return pr;
      }
    ,[store])
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
    <CmsLayout>
      <CmsSider />
      <TopHead />
      <>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={callbacks.openAddModal}>
            Добавить товар
          </Button>
        </Space>
        <CmsTableLayout data={tableData}
                  paginationConfig={paginationConfig}
                  loading={select.loadingCatalog || select.loadingCategories}
                  onSorting={callbacks.sort}
                  drawerDetails={callbacks.openDrawer}
                  onFiltering={callbacks.onSearch}
                  editArticle={callbacks.openEditModal}
                  deleteArticle={callbacks.deleteArticle}/>
      </>

    </CmsLayout>
    <Drawer open={isOpen} onClose={() => setIsOpen(false)} size="large">
      <Spinner active={select.loadingArticle}>
        <Title style={{paddingLeft: "40px"}}>{select.article?.title}</Title>
        <ArticleCard article={select.article} onAdd={() => {}} t={t}/>
      </Spinner>
    </Drawer>
    </>

  )
}

export default memo(CmsCatalog);
