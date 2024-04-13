import { memo } from 'react';

import { Drawer } from 'antd';

import { useAdminContext } from '../..';

import ArticleInfo from '@src/components/article-info';

function ArticlesDrawers() {
  const { values, callbacks, options } = useAdminContext();

  return (
    <>
      <Drawer
        title={values.activeArticle?.title}
        width={550}
        onClose={callbacks.closeDrawerLookArticle}
        open={options.isLookArticleDrawerActive}
      >
        {values.activeArticle && <ArticleInfo article={values.activeArticle} />}
      </Drawer>
    </>
  );
}

export default memo(ArticlesDrawers);
