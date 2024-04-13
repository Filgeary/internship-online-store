import { memo } from 'react';

import { Drawer } from 'antd';

import { useAdminContext } from '../..';

import ArticleCard from '@src/components/article-card';

function ArticlesDrawer() {
  const { values, callbacks, options } = useAdminContext();

  return (
    <>
      <Drawer
        title={values.activeArticle?.title}
        width={550}
        onClose={callbacks.closeDrawerLookArticle}
        open={options.isLookArticleDrawerActive}
      >
        {values.activeArticle ? (
          <ArticleCard article={values.activeArticle} onAdd={() => {}} t={() => {}} />
        ) : (
          <></>
        )}
      </Drawer>
    </>
  );
}

export default memo(ArticlesDrawer);
