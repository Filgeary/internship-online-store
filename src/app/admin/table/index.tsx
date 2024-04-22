import React, { FC, memo, useCallback, useEffect, useRef, useState } from 'react'
import useSelector from '@src/hooks/use-selector'
import { useDispatch, useSelector as useSelectorRedux } from 'react-redux'
import articleActions from '@src/store-redux/article/actions'
import { IResult, StoreState } from '@src/store/types'
import shallowequal from 'shallowequal'
import useInit from '@src/hooks/use-init'
import type { TableColumnsType } from 'antd'
import { Button, Space, Table } from 'antd'
import * as Icons from '@ant-design/icons'
import useStore from '@src/hooks/use-store'

const { EditOutlined, DeleteOutlined } = Icons

interface ITable {
  showDrawer: (id: string) => void
  product: DataType[]
}

export interface DataType {
  key: React.Key
  name: string
  description: string
  manufacturer: string
  category: string
  price: string | number
}

const _Table: FC<ITable> = ({showDrawer, product}) => {
  const store = useStore()

  useInit(async () => {
    await store.actions.catalog.initParams()
  }, [])


  const onEditProduct = (record: DataType) => {
    showDrawer(String(record.key))
  }

  const onDeleteProduct = (value: string | undefined) => {}

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Название',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Описание',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Производитель',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Цена',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => (a.price as number) - (b.price as number),
    },
    {
      title: 'Опции',
      dataIndex: 'options',
      key: 'options',
      render: (value, record) => {
        return (
          <Space>
            <EditOutlined
              onClick={() => {
                onEditProduct(record)
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteProduct(value)
              }}
              style={{ color: 'red', marginLeft: 12 }}
            />
          </Space>
        )
      },
    },
  ]

  return (
    <>
      {product.length && (
        <Table columns={columns} dataSource={product} pagination={false} />
       )} 
    </>
  )
}

export default _Table
