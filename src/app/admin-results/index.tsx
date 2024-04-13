import 'antd/dist/reset.css';

import { memo } from 'react';

import Admin from '@src/containers/admin';

import useInit from '@src/hooks/use-init';
import useStore from '@src/hooks/use-store';

function AdminResultsPage() {
  const store = useStore();

  useInit(async () => {
    await Promise.all([
      store.actions.admin.fetchAllArticles(),
      store.actions.admin.fetchAllCities(),
    ]);
  });

  return (
    <Admin.Root>
      <Admin.Results />
    </Admin.Root>
  );
}

export default memo(AdminResultsPage);
