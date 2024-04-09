import '../reset.css';

import { memo } from 'react';

import AdminPanel from '@src/containers/admin-panel';
import useStore from '@src/hooks/use-store';
import useInit from '@src/hooks/use-init';

function AdminPage() {
  const store = useStore();

  useInit(async () => {
    await Promise.all([store.actions.admin.fetchArticles(), store.actions.admin.fetchCities()]);
  });

  return <AdminPanel />;
}

export default memo(AdminPage);
