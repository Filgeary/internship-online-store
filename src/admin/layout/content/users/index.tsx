import Head from "@src/components/head";
import LocaleSelect from "@src/containers/locale-select";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";
import useTranslate from "@src/hooks/use-translate";
import { Modal, Space, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import { TableParams } from "./type";
import { CardTemplate } from "@src/admin/components/card-template";
import { columns } from "./columns";
import { cards } from "./cards";

export const Users = () => {
  const [params, setParams] = useState<TableParams>({pagination: {current: 1}});
  const store = useStore();
  const select = useSelector((state) => ({
    users: state.users.users,
    count: state.users.count,
    newCount: state.users.newCount,
    confirmCount: state.users.confirmCount,
    rejectCount: state.users.rejectCount,
    pageCount: state.users.totalCount,
    waiting: state.users.waiting,
  }));
  const { t } = useTranslate();

  const onDelete = (_id: string) =>
    Modal.confirm({
      title: "Are you sure, you want to delete this user record?",
      okType: "danger",
      onOk: () => {
        store.actions.users.delete(_id);
      },
    });

  const tableData = select.users?.map((user) => ({
    ...user,
    key: user._id,
    dateCreate: new Date(user.dateCreate).toUTCString(),
  }));

  const tableColumns = columns(onDelete);
  const userCards = cards('New', select.newCount, 'Confirm', select.confirmCount, "Reject", select.rejectCount)

  const handleChange: TableProps["onChange"] = (pagination, filters, sorter) => {
    setParams({
      pagination,
      filters,
      ...sorter,
    });
  }

  useEffect(() => {
    store.actions.users.setParams(params);
  }, [params]);

  return (
    <>
      <Head title={t("admin.users")}>
        <LocaleSelect />
      </Head>
      <Space direction="horizontal" size="middle" style={{marginBottom: "20px"}}>
        {userCards.map(card => (
          <CardTemplate key={card.title} title={card.title} prefix={card.prefix} icon={card.icon} color={card.color} count={card.count}/>
        ))}
      </Space>
      <Table
        onChange={handleChange}
        loading={select.waiting}
        dataSource={tableData}
        columns={tableColumns}
        pagination={{
          total: select.pageCount,
          showSizeChanger: false,
        }}
      ></Table>
    </>
  );}
