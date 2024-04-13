import type { TableProps } from 'antd';
import { Button, Pagination, Popconfirm, Row, Space, Spin, Table, Typography } from 'antd';
import { memo, useCallback } from 'react';

import useSelector from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';
import useTranslate from '@src/hooks/use-translate';
import numberFormat from '@src/utils/number-format';

import type { IArticle } from '@src/types/IArticle';

type Props = {
  catalogSliceName?: 'catalog' | `catalog${number}`;
};

function AdminCatalogArticles({ catalogSliceName = 'catalog' }: Props) {
  const store = useStore();
  const { t } = useTranslate();

  const select = useSelector(state => ({
    list: state[catalogSliceName].list,
    page: state[catalogSliceName].params.page,
    limit: state[catalogSliceName].params.limit,
    sort: state[catalogSliceName].params.sort,
    query: state[catalogSliceName].params.query,
    category: state[catalogSliceName].params.category,
    madeIn: state[catalogSliceName].params.madeIn,
    count: state[catalogSliceName].count,
    waiting: state[catalogSliceName].waiting,
    allCountries: state.countries.list,
    allCategories: state.categories.list,
  }));

  const callbacks = {
    onPaginate: useCallback(
      (page: string | number, limit: number) =>
        store.actions[catalogSliceName].setParams({ page, limit }),
      [catalogSliceName, store],
    ),
    // TODO: implement on Pagination component with itemRender?
    makePaginatorLink: useCallback(
      (page: string) => {
        return `?${new URLSearchParams({
          page,
          limit: String(select.limit),
          sort: select.sort,
          query: select.query,
          category: select.category,
          madeIn: select.madeIn,
        })}`;
      },
      [select.limit, select.sort, select.query, select.category, select.madeIn],
    ),
  };

  /* specific fields from IArticle
  name: string;
  title: string;
  description: string;
  price: number;
  madeIn: MadeIn;
  edition: number;
  category: Category;
   */

  // configure table
  const dataSource = select.list.map((item: IArticle) => ({
    ...item,
    key: item._id,
    madeIn:
      item.madeIn?.title || select.allCountries.find(c => c._id === item.madeIn?._id)?.title || '',
    category:
      item.category?.title ||
      select.allCategories.find(c => c._id === item.category?._id)?.title ||
      '',
  }));

  type TMappedArticle = (typeof dataSource)[0];

  const columns: TableProps<TMappedArticle>['columns'] = [
    {
      title: t('admin.catalog.name'),
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <Typography.Title
          level={5}
          style={{ wordBreak: 'keep-all', margin: 0 }}
        >
          {text}
        </Typography.Title>
      ),
    },
    {
      title: t('admin.catalog.description'),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t('admin.catalog.category'),
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => (
        <Typography.Text
          italic
          style={{ wordBreak: 'keep-all' }}
        >
          {text}
        </Typography.Text>
      ),
    },
    {
      title: t('admin.catalog.madeIn'),
      dataIndex: 'madeIn',
      key: 'madeIn',
    },
    {
      title: t('admin.catalog.edition'),
      dataIndex: 'edition',
      key: 'edition',
    },
    {
      title: t('admin.catalog.price'),
      dataIndex: 'price',
      key: 'price',
      render: (text: number) => (
        <Typography.Text
          strong
          style={{ wordBreak: 'keep-all' }}
        >
          {numberFormat(text, undefined, { style: 'currency', currency: 'RUB' })}
        </Typography.Text>
      ),
    },
    {
      title: t('admin.catalog.actions'),
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record: TMappedArticle) => (
        <Space size='middle'>
          <Button
            type='primary'
            onClick={() => console.log('edit', record._id)} // TODO: edit
          >
            {t('admin.catalog.edit')}
          </Button>

          <Popconfirm
            title={t('admin.catalog.confirmDelete')}
            onConfirm={() => console.log('delete', record._id)} // TODO: delete
          >
            <Button
              type='primary'
              danger
            >
              {t('admin.catalog.delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={select.waiting}>
      <Row
        gutter={[0, 32]}
        style={{ flexDirection: 'column' }}
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />

        <Pagination
          style={{ textAlign: 'center' }}
          current={select.page}
          pageSize={select.limit}
          total={select.count}
          onChange={callbacks.onPaginate}
          hideOnSinglePage
        />
      </Row>
    </Spin>
  );
}

export default memo(AdminCatalogArticles);
