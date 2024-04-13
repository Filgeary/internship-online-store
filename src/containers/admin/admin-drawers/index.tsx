import { memo } from 'react';

import ArticlesDrawers from './articles-drawers';

function AdminDrawers() {
  return (
    <>
      <ArticlesDrawers />
    </>
  );
}

export default memo(AdminDrawers);
