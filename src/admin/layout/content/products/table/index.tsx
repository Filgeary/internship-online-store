import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/EditOutlined";
import InfoCircleOutlined from "@ant-design/icons/InfoCircleOutlined";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import { Button, Flex, Input, Modal, Table, TableColumnsType, TableProps } from "antd";
import { useCallback, useState } from "react";
import { ArticleInfo } from "../article-info.tsx";
import { Article } from "@src/store/article/type.ts";
import useTranslate from "@src/hooks/use-translate.ts";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";

export const ProductsTable = () => {
  const [articleInfo, setOpenArticleInfo] = useState(false);
  const { t } = useTranslate();

  const store = useStore();
  const select = useSelector((state) => ({
    products: state["catalog_admin"]?.list,
    count: state["catalog_admin"]?.count,
    waiting: state["catalog_admin"]?.waiting,
    params: state["catalog_admin"]?.params,
    countries: state["countries_admin"]?.list,
    categories: state["categories_admin"]?.list,
  }));

  const tableData = select.products?.map((product) => ({
    ...product,
    key: product._id,
  }));

  const columns: TableColumnsType<Article> = [
    {
      title: t("admin.table.title"),
      dataIndex: "title",
      filterDropdown: ({
        selectedKeys,
        setSelectedKeys,
        confirm,
        clearFilters,
      }) => (
        <Flex gap={5} style={{padding: 10}}>
          <Input
            placeholder="Search"
            defaultValue={select.params?.query as string}
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
              confirm({closeDropdown: false});
            }}
            onPressEnter={() => confirm()}
          ></Input>
          <Button onClick={() => clearFilters!()}>Reset</Button>
        </Flex>
      ),
      filterIcon: () => <SearchOutlined />,
      width: "18%",
    },
    {
      title: t("admin.table.category"),
      dataIndex: "category",
      render: ({ _id }) => {
        const category = select.categories?.find(
          (category) => category._id === _id
        );
        return category?.title;
      },
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
      render: (madeIn) => {
        const country = select.countries?.find(
          (country) => country._id === madeIn?._id
        );
        return country?.title;
      },
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
      sorter: {
        multiple: 2,
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
      render: (_id: string) => (
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
    },
  ];

  const callbacks = {
    onDelete: (_id: string) => {
      Modal.confirm({
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
  };

  const handleChange: TableProps["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    console.log(filters)
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
      category: filters?.category ? filters.category : "",
      madeIn: filters?.madeIn ? filters.madeIn : "",
      query: filters?.title ? filters.title : "",
    };
    console.log(params)
    store.actions["catalog_admin"]?.setParams(params);
  };
  return (
    <>
      <Table
        bordered
        tableLayout="fixed"
        onChange={handleChange}
        loading={select.waiting}
        columns={columns}
        dataSource={tableData}
        pagination={{
          showSizeChanger: false,
          current: select.params?.page,
          total: select.count,
        }}
      ></Table>
      <ArticleInfo
        open={articleInfo}
        onClose={() => setOpenArticleInfo(false)}
      />
    </>
  );
};
