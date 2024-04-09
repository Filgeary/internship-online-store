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
        console.log({ value, record, index });

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

  return (
    <Table
      columns={extendedColumns}
      dataSource={data}
      pagination={{
        defaultPageSize: 5,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 15],
      }}
    />
  );
}

export default memo(PaginationTable);
