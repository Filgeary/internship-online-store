import { memo } from 'react';

import Admin from '@src/containers/admin';

function AdminNotesPage() {
  return (
    <Admin.Root>
      <div>AdminNotesPage</div>
    </Admin.Root>
  );
}

export default memo(AdminNotesPage);
