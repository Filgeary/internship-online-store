import { Button, Input, Popconfirm, Space, Table, TablePaginationConfig, Tooltip, message } from "antd";
import { ChangeEvent, memo, useCallback, useState } from "react"
import { TableArticleType } from "../../../utils/cms/table-data-format";
import Column from "antd/es/table/Column";
import { FilterDropdownProps, SorterResult } from "antd/es/table/interface";
import { DeleteOutlined, FormOutlined, MoreOutlined, SearchOutlined } from "@ant-design/icons";
import debounce from "lodash.debounce";

type CmsTableLayoutPropsType = {
  data: TableArticleType[];
  paginationConfig: TablePaginationConfig;
  loading: boolean;
  onSorting?: (s: SorterResult<TableArticleType> | SorterResult<TableArticleType>[]) => void;
  onFiltering?: (value: string) => void;
  drawerDetails: (id: string) => void;
  editArticle: (id: string) => void;
  deleteArticle: (id: string) => Promise<void>;
}

function CmsTableLayout(props: CmsTableLayoutPropsType) {
  const [value, setValue] = useState("");

  // // Article title debounce
  const onChangeDebounce = useCallback(debounce(value => props.onFiltering(value), 600), []);
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChangeDebounce(event.target.value);
  };

  const callbacks = {
    sortChanged: (s: SorterResult<TableArticleType> | SorterResult<TableArticleType>[]) => {
      if(props.onSorting !== undefined)
        props?.onSorting(s)
    },
    deleteArticle: (id: string) => {
      const pr = props.deleteArticle(id);
      pr.then(result => message.success(`Товар успешно удален`))
        .catch(result => message.error(`При удалении возникла ошибка`))

      return pr;
    },
    openDrawer: (id: string) => props.drawerDetails(id),
    openEditAtricle: (id: string) => props.editArticle(id),
  }

  // Article title filter
  const filterDropdown = (props: FilterDropdownProps) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder="Наименование товара"
        value={value}
        onChange={onChange}
      />
    </div>
  )
  // Article title filter icon
  const filterIcon = (filtered: boolean) => (
    <SearchOutlined style={{ color: value ? '#1890ff' : undefined }} />
  )

  return (
    <Table dataSource={props.data}
           pagination={props.paginationConfig}
           size="small"
           loading={props.loading}
           onChange={(p, f, s) => callbacks.sortChanged(s)}
    >
      <Column key="title" dataIndex="title" title="Название"
              filterDropdown={filterDropdown}
              filterSearch={true}
              filterIcon={filterIcon}/>
      <Column key="price" dataIndex="price" title="Цена" sorter/>
      <Column key="category" dataIndex="category" title="Категория" />
      <Column key="edition" dataIndex="edition" title="Год выпуска" />
      <Column title="Действия"
              key="action"
              align="right"
              render={(_: any, record: TableArticleType) => (
                <Space size="small">
                  <Button onClick={() => callbacks.openEditAtricle(record.key.toString())}
                          type="primary"
                          size="small"
                          icon={<FormOutlined />}
                  />
                  <Tooltip placement="top" title="Детали">
                    <Button type="primary" icon={<MoreOutlined />} size="small"
                            onClick={() => callbacks.openDrawer(record.key.toString())}  />
                  </Tooltip>

                  <Tooltip placement="top" title="Удалить">
                    <Popconfirm title="Вы уверены что хотите удалить товар?"
                                placement="left"
                                onConfirm={() => callbacks.deleteArticle(record.key.toString())}>
                      <Button type="primary" icon={<DeleteOutlined />} size="small"/>
                    </Popconfirm>
                  </Tooltip>

                </Space>
              )}
      />
   </Table>
  )
}

export default memo(CmsTableLayout);
