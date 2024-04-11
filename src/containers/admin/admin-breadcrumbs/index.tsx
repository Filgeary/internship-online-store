import { memo } from 'react';
import { Link } from 'react-router-dom';

import { Breadcrumb } from 'antd';

const items = [
  {
    title: 'Главная',
    path: '/',
  },
  {
    title: 'Админ-панель',
  },
];

function itemRender(currentRoute: { title: string; path: string }) {
  if (currentRoute.path) {
    return <Link to={currentRoute.path}>{currentRoute.title}</Link>;
  }

  return <span>{currentRoute.title}</span>;
}

function AdminBreadcrumbs() {
  return <Breadcrumb style={{ margin: '16px 0' }} itemRender={itemRender} items={items} />;
}

export default memo(AdminBreadcrumbs);
