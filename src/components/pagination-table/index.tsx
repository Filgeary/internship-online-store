import { memo } from 'react';

import { Button, Popconfirm, Space, Table, Tooltip } from 'antd';

import type { TableColumnsType } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

type TProps = {
  columns: TableColumnsType<any>;
  data: any;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onPaginationChange: (page: number, pageSize: number) => void;
  totalPagination?: number;
  pageSize: number;
  page: number;
  loading?: boolean;
};

function PaginationTable(props: TProps) {
  const { columns, data } = props;
  const extendedColumns: TableColumnsType<any> = [
    ...columns,
    {
      title: 'Действие',
      key: 'operation',
      fixed: 'right',
      render: (value, record, index) => {
        return (
          <>
            <Space size={'middle'}>
              <Popconfirm
                title='Удалить запись?'
                description='Вы уверены в своём выборе?'
                onConfirm={() => props.onDelete(value._id)}
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              >
                <Tooltip title='Удалить'>
                  <Button type='default' shape='circle' icon={<DeleteOutlined />} />
                </Tooltip>
              </Popconfirm>

              <Tooltip title='Изменить'>
                <Button
                  type='default'
                  shape='circle'
                  icon={<EditOutlined />}
                  onClick={() => props.onEdit(value._id)}
                />
              </Tooltip>
            </Space>
          </>
        );
      },
    },
  ];
  const extendedData = [...Array(props.pageSize * (props.page - 1)).fill({}), ...data];

  return (
    <Table
      loading={props.loading || false}
      columns={extendedColumns}
      dataSource={extendedData}
      pagination={{
        total: props.totalPagination || data.length,
        pageSize: props.pageSize,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 15],
        onChange: props.onPaginationChange,
      }}
    />
  );
}

export default memo(PaginationTable);
