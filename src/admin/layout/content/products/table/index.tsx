import { useCallback, useEffect, useState } from "react";
import {
  App,
  Button,
  Flex,
  Input,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/EditOutlined";
import InfoCircleOutlined from "@ant-design/icons/InfoCircleOutlined";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import { ArticleInfo } from "../article-info.tsx";
import { Article } from "@src/store/article/type.ts";
import useTranslate from "@src/hooks/use-translate.ts";
import { FilterDropdownProps } from "antd/es/table/interface";
import { Loader } from "@src/admin/layout/spin/index.tsx";

export const ProductsTable = () => {
  const [articleInfo, setOpenArticleInfo] = useState(false);
  const [columnsTable, setColumns] = useState<TableColumnsType<Article>>();
  const { t } = useTranslate();
  const { message, modal } = App.useApp();
  const store = useStore();
  const select = useSelector((state) => ({
    products: state["catalog_admin"]?.list,
    count: state["catalog_admin"]?.count,
    waiting: state["catalog_admin"]?.waiting,
    page: state["catalog_admin"]?.params.page,
    madeIn: state["catalog_admin"]?.params.madeIn,
    category: state["catalog_admin"]?.params.category,
    sort: state["catalog_admin"]?.params.sort,
    query: state["catalog_admin"]?.params.query,
    countries: state["countries_admin"]?.list,
    categories: state["categories_admin"]?.list,
  }));

  const tableData = select.products?.map((product) => ({
    ...product,
    key: product._id,
  }));

  useEffect(() => {
    if (select.categories?.length && select.countries?.length) {
      const columns: TableColumnsType<Article> = [
        {
          title: t("admin.table.title"),
          dataIndex: "title",
          filterDropdown: callbacks.filterRenderTitle,
          filterIcon: () => <SearchOutlined />,
          width: "18%",
        },
        {
          title: t("admin.table.category"),
          dataIndex: "category",
          defaultFilteredValue: select.category
            ? select.category.split(",")
            : null,
          render: ({ _id }) =>
            select.categories?.find((category) => category._id === _id)?.title,
          filters: select.categories?.map((category) => ({
            text: category.title,
            value: category._id,
          })),
          filterSearch: true,
          width: "15%",
        },
        {
          title: t("admin.table.country"),
          dataIndex: "madeIn",
          defaultFilteredValue: select.madeIn ? select.madeIn.split(",") : null,
          render: (madeIn) =>
            select.countries?.find((country) => country._id === madeIn?._id)
              ?.title,
          filters: select.countries?.map((country) => ({
            text: country.title,
            value: country._id,
          })),
          filterSearch: true,
          width: "25%",
        },
        {
          title: t("admin.table.price"),
          dataIndex: "price",
          defaultSortOrder: (select.sort as string)?.includes("price")
            ? (select.sort as string).includes("-price")
              ? "descend"
              : "ascend"
            : undefined,
          sorter: {
            multiple: 2,
            compare: (a, b) => a.price - b.price,
          },
          width: "14%",
        },
        {
          title: t("admin.table.edition"),
          dataIndex: "edition",
          sorter: {
            multiple: 1,
          },
          width: "14%",
        },
        {
          title: t("admin.table.actions"),
          dataIndex: "_id",
          width: "14%",
          render: callbacks.renderActions,
        },
      ];
      setColumns(columns);
    }
  }, [
    select.category,
    select.madeIn,
    select.sort,
    select.categories,
    select.countries,
  ]);

  const callbacks = {
    onDelete: (_id: string) => {
      modal.confirm({
        title: "Are you sure, you want to delete this product record?",
        onOk: () => {
          store.actions["catalog_admin"]?.delete(_id);
        },
      });
    },
    onEdit: useCallback(
      async (_id: string) => {
        await store.actions.article.load(_id);
        store.actions.modals.open("edit_product").then((value: any) => {
          const body = value.edition
            ? {
                ...value,
                edition: value.edition["$y"],
                madeIn: {
                  _id: value.madeIn,
                },
                category: {
                  _id: value.category,
                },
              }
            : value;
          store.actions["catalog_admin"]?.edit(_id, JSON.stringify(body));
          message.success("Product's information was updated!");
        });
      },
      [store]
    ),
    onInform: useCallback(
      (_id: string) => {
        setOpenArticleInfo(true);
        store.actions.article.load(_id);
      },
      [store]
    ),
    filterRenderTitle: ({
      selectedKeys,
      setSelectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <Flex gap={5} style={{ padding: 10 }}>
        <Input
          placeholder="Search"
          defaultValue={select.query as string}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            confirm({ closeDropdown: false });
          }}
          onPressEnter={() => confirm()}
        ></Input>
        <Button onClick={() => clearFilters!()}>Reset</Button>
      </Flex>
    ),
    renderActions: (_id: string) => (
      <Flex gap={15}>
        <InfoCircleOutlined
          onClick={() => callbacks.onInform(_id)}
          style={{ color: "blue", cursor: "pointer", fontSize: 16 }}
        />
        <EditOutlined
          onClick={() => callbacks.onEdit(_id)}
          style={{ color: "green", cursor: "pointer", fontSize: 16 }}
        />
        <DeleteOutlined
          onClick={() => callbacks.onDelete(_id)}
          style={{ color: "red", cursor: "pointer", fontSize: 16 }}
        />
      </Flex>
    ),
  };

  const handleChange: TableProps["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    const fields = Array.isArray(sorter)
      ? sorter
          .map((item) =>
            item.order === "ascend" ? item.field : `-${item.field}`
          )
          .join(",")
      : sorter.order === "ascend"
      ? sorter.field
      : sorter.order === "descend"
      ? `-${sorter.field}`
      : "";

    const params = {
      limit: pagination.pageSize,
      page: pagination.current,
      sort: fields,
      category: filters?.category ? filters.category.join(",") : "",
      madeIn: filters?.madeIn ? filters.madeIn.join(",") : "",
      query: filters?.title ? filters.title : "",
    };
    store.actions["catalog_admin"]?.setParams(params);
  };

  return (
    <>
      {columnsTable ? (
        <Table
          bordered
          tableLayout="fixed"
          onChange={handleChange}
          loading={select.waiting}
          columns={columnsTable}
          dataSource={tableData}
          pagination={{
            showSizeChanger: false,
            current: select.page,
            total: select.count,
          }}
          scroll={{ y: "70vh" }}
        />
      ) : (
        <Loader minHeight="40vh" />
      )}
      <ArticleInfo
        open={articleInfo}
        onClose={() => setOpenArticleInfo(false)}
      />
    </>
  );
};
