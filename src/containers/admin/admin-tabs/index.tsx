import { memo } from 'react';

import { useAdminContext } from '..';
import { Button, Tabs, theme } from 'antd';

import PaginationTable from '@src/components/pagination-table';

function AdminPanelTabs() {
  const { select, handlers } = useAdminContext();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div
      style={{
        padding: 24,
        minHeight: 360,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <Tabs
        defaultActiveKey='1'
        items={[
          {
            label: 'Товары',
            key: 'articles',
            children: (
              <>
                <PaginationTable
                  onDelete={handlers.onDeleteArticle}
                  onEdit={handlers.onEditArticle}
                  onPaginationChange={handlers.onArticlesPaginationChange}
                  totalPagination={select.totalArticlesCount}
                  pageSize={select.articlesLimitByPage}
                  page={select.articlesPage}
                  loading={select.articlesFetching}
                  rowKey={'_id'}
                  columns={[
                    {
                      title: 'Название',
                      dataIndex: 'title',
                      key: 'title',
                      fixed: 'left',
                    },
                    {
                      title: 'Цена',
                      dataIndex: 'price',
                      key: 'price',
                      fixed: 'left',
                      sorter: (a, b) => a.price - b.price,
                    },
                    {
                      title: 'Категория',
                      dataIndex: ['category', 'title'],
                      key: 'category.title',
                    },
                  ]}
                  data={select.articles}
                />

                <Button type='primary' onClick={handlers.onAddArticleBtnClick}>
                  Добавить
                </Button>
              </>
            ),
          },
          {
            label: 'Города',
            key: 'cities',
            children: (
              <>
                <PaginationTable
                  onDelete={handlers.onDeleteCity}
                  onEdit={handlers.onEditCity}
                  onPaginationChange={handlers.onCitiesPaginationChange}
                  totalPagination={select.totalCitiesCount}
                  pageSize={select.citiesLimitByPage}
                  page={select.citiesPage}
                  loading={select.citiesFetching}
                  rowKey={'_id'}
                  columns={[
                    {
                      title: 'Название',
                      dataIndex: 'title',
                      key: 'title',
                      fixed: 'left',
                    },
                    {
                      title: 'Население',
                      dataIndex: 'population',
                      key: 'population',
                      fixed: 'left',
                      sorter: (a, b) => a.population - b.population,
                    },
                  ]}
                  data={select.cities}
                />

                <Button type='primary' onClick={handlers.onAddCityBtnClick}>
                  Добавить
                </Button>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}

export default memo(AdminPanelTabs);
