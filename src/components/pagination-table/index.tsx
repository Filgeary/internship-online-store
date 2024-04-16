import { memo } from 'react';

import { Button, Popconfirm, Space, Table, Tooltip } from 'antd';

import type { TableColumnsType, TablePaginationConfig } from 'antd';
import { EyeOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { FilterValue, SorterResult } from 'antd/es/table/interface';

type TProps = {
  columns: TableColumnsType<any>;
  data: any;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onLook?: (id: string) => void;
  onTableChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<any> | SorterResult<any>[]
  ) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
  totalPagination?: number;
  pageSize: number;
  page: number;
  loading?: boolean;
  rowKey?: string;
};

function PaginationTable(props: TProps) {
  const { columns, data } = props;
  const extendedColumns: TableColumnsType<any> = [
    ...columns,
    {
      title: 'Действие',
      key: 'operation',
      fixed: 'right',
      render: (value) => {
        return (
          <>
            <Space size={'middle'}>
              <Popconfirm
                title='Удалить запись?'
                description='Вы уверены в своём выборе?'
                onConfirm={() => props.onDelete(value._id)}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              >
                <Button danger type='default' shape='circle' icon={<DeleteOutlined />} />
              </Popconfirm>

              <Tooltip title='Изменить'>
                <Button
                  type='default'
                  shape='circle'
                  icon={<EditOutlined />}
                  onClick={() => props.onEdit(value._id)}
                />
              </Tooltip>

              {props.onLook && (
                <div style={{ marginLeft: '15px' }}>
                  <Tooltip title='Показать'>
                    <Button
                      type='default'
                      shape='circle'
                      icon={<EyeOutlined />}
                      onClick={() => props.onLook(value._id)}
                    />
                  </Tooltip>
                </div>
              )}
            </Space>
          </>
        );
      },
    },
  ];
  // const extendedData = [...Array(props.pageSize * (props.page - 1)).fill({}), ...data];

  console.log(props.onTableChange);

  return (
    <Table
      loading={props.loading || false}
      columns={extendedColumns}
      dataSource={data}
      rowKey={props.rowKey || '_id'}
      // onChange={(pagination, filters, sorter) => console.log({ pagination, filters, sorter })}
      onChange={props.onTableChange}
      pagination={{
        total: props.totalPagination || data.length,
        current: props.page,
        pageSize: props.pageSize,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 15],
        onChange: props.onPaginationChange,
      }}
    />
  );
}

export default memo(PaginationTable);
