import { memo } from 'react';

import { Tabs, theme } from 'antd';

import CitiesCharts from './cities-charts';

function AdminCharts() {
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
        items={[
          { label: 'Товары', key: '1', children: <div>Графики для товаров</div> },
          { label: 'Города', key: '2', children: <CitiesCharts /> },
        ]}
      />
    </div>
  );
}

export default memo(AdminCharts);
