import '../reset.css';

import { memo } from 'react';

import Admin from '@src/containers/admin';

import useStore from '@src/hooks/use-store';
import useInit from '@src/hooks/use-init';

function AdminPage() {
  const store = useStore();

  useInit(async () => {
    await Promise.all([
      store.actions.admin.fetchArticles(),
      store.actions.admin.fetchCities(),
      store.actions.categories.load(),
    ]);
  });

  return (
    <Admin.Root>
      <Admin.Tabs />
    </Admin.Root>
  );
}

export default memo(AdminPage);
