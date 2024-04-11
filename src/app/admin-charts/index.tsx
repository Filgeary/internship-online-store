import '../reset.css';

import { memo } from 'react';

import Admin from '@src/containers/admin';

import useStore from '@src/hooks/use-store';
import useInit from '@src/hooks/use-init';

function AdminChartsPage() {
  const store = useStore();

  useInit(async () => {
    await store.actions.admin.fetchAllCities();
  });

  return (
    <Admin.Root>
      <Admin.Charts />
    </Admin.Root>
  );
}

export default memo(AdminChartsPage);
