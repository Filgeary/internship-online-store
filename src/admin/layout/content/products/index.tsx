import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import EditOutlined from "@ant-design/icons/EditOutlined";
import Head from "@src/components/head";
import LocaleSelect from "@src/containers/locale-select";
import useInit from "@src/hooks/use-init";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import { Button, Flex, Modal, Space, Table, TableProps } from "antd";
import { useCallback } from "react";

export const Products = () => {
  const { t } = useTranslate();
  const store = useStore();
  const select = useSelector((state) => ({
    products: state["catalog_admin"]?.list,
    count: state["catalog_admin"]?.count,
    waiting: state["catalog_admin"]?.waiting,
    current: state["catalog_admin"]?.params.page
  }));

  useInit(async () => {
    await store.actions["catalog_admin"]?.initParams();
  })

  const callbacks = {
    onDelete: (_id: string) => {
      Modal.confirm({
        title: "Are you sure, you want to delete this product record?",
        onOk: () => {
          store.actions["catalog_admin"]?.delete(_id);
        },
      });
    },
    addNewProduct: useCallback(() => {
      store.actions.modals.open("add_product").then((value: any) => {
        console.log(value.edition["$y"]);
        const body = {
          name: value.name,
          title: value.title,
          description: value.description || "",
          price: value.price,
          madeIn: {
            _id: value.country,
          },
          edition: value.edition["$y"],
          category: {
            _id: value.category,
          },
        };
        store.actions["catalog_admin"]?.create(JSON.stringify(body));
      });
    }, [store]),
    onEdit: useCallback((_id: string) => {
      store.actions.modals.open("edit_product").then((value: any) => {
        const body = value.edition ? {
          ...value,
          edition: value.edition['$y']
        } : value
        store.actions["catalog_admin"]?.edit(_id, JSON.stringify(body));
      });
    }, [store]),
  };

  const tableData = select.products?.map(product => ({
    ...product,
    key: product._id
  }))

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: {
        multiple: 2,
      },
    },
    {
      title: "Edition",
      dataIndex: "edition",
      sorter: {
        multiple: 1,
      },
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (_id: string) => (
        <Flex gap={15}>
          <EditOutlined
            onClick={() => callbacks.onEdit(_id)}
            style={{ color: "green", cursor: "pointer", fontSize: 18 }}
          />
          <DeleteOutlined
            onClick={() => callbacks.onDelete(_id)}
            style={{ color: "red", cursor: "pointer", fontSize: 18 }}
          />
        </Flex>
      ),
    },
  ];

const handleChange: TableProps["onChange"] = (pagination, filters, sorter) => {
  const fields = Array.isArray(sorter)
    ? sorter
        .map((item) =>
          item.order === "ascend" ? item.field : `-${item.field}`
        )
        .join(",")
    : sorter.order === "ascend"
    ? sorter.field
    : `-${sorter.field}`;

  const params = {
    limit: pagination.pageSize,
    page: pagination.current,
    sort: fields,
  };

  store.actions["catalog_admin"]?.setParams(params)
};

  return (
    <>
      <Head title={t("admin.products")}>
        <LocaleSelect />
      </Head>
      <Space direction="vertical" style={{display: 'flex'}}>
        <Button type="primary" onClick={callbacks.addNewProduct}>+Add new product</Button>
        <Table onChange={handleChange} loading={select.waiting} columns={columns} dataSource={tableData} pagination={{showSizeChanger: false, current: select.current, total: select.count}}></Table>
      </Space>
    </>
  );};
