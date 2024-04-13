import 'antd/dist/reset.css';

import { memo } from 'react';

import Admin from '@src/containers/admin';

function AdminNotesPage() {
  return (
    <Admin.Root>
      <Admin.Notes />
    </Admin.Root>
  );
}

export default memo(AdminNotesPage);
