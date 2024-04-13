import { memo } from 'react';

import ArticlesDrawer from './articles-drawer';

function AdminDrawers() {
  return (
    <>
      <ArticlesDrawer />
    </>
  );
}

export default memo(AdminDrawers);
