import { memo } from 'react';

import { useAdminContext } from '..';
import { Tabs, theme } from 'antd';
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
            key: '1',
            children: (
              <PaginationTable
                onDelete={handlers.onDeleteArticle}
                onEdit={handlers.onEditArticle}
                onPaginationChange={handlers.onArticlesPaginationChange}
                totalPagination={select.totalArticlesCount}
                pageSize={select.articlesLimitByPage}
                page={select.articlesPage}
                loading={select.articlesFetching}
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
                ]}
                data={select.articles}
              />
            ),
          },
          {
            label: 'Города',
            key: '2',
            children: (
              <PaginationTable
                onDelete={handlers.onDeleteCity}
                onEdit={handlers.onEditCity}
                onPaginationChange={handlers.onCitiesPaginationChange}
                totalPagination={select.totalCitiesCount}
                pageSize={select.citiesLimitByPage}
                page={select.citiesPage}
                loading={select.citiesFetching}
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
            ),
          },
        ]}
      />
    </div>
  );
}

export default memo(AdminPanelTabs);
