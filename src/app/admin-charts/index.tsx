import '../reset.css';

import { memo } from 'react';

import Admin from '@src/containers/admin';

function AdminChartsPage() {
  return (
    <Admin.Root>
      <Admin.Charts />
    </Admin.Root>
  );
}

export default memo(AdminChartsPage);
