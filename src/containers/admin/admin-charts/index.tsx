import { memo } from 'react';

import { Tabs, theme } from 'antd';

import CitiesCharts from './cities-charts';
import ArticlesCharts from './articles-charts';

import { useAdminContext } from '..';

function AdminCharts() {
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
        activeKey={select.activeCatalogEntity}
        onChange={handlers.onTabKeyChange}
        items={[
          {
            label: 'Товары',
            key: 'articles',
            children: <ArticlesCharts />,
          },
          { label: 'Города', key: 'cities', children: <CitiesCharts /> },
        ]}
      />
    </div>
  );
}

export default memo(AdminCharts);
