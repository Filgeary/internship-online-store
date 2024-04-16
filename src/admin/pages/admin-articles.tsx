import { Row, Typography } from 'antd';

import useInit from '@src/hooks/use-init';
import useStore from '@src/hooks/use-store';
import AdminCatalogArticles from '../components/admin-catalog-articles';
import AdminCatalogFilter from '../components/admin-catalog-filter';

import type { IArticle } from '@src/types/IArticle';

const AdminArticles = () => {
  const store = useStore();

  useInit(
    async () => {
      if (!store.hasSlice('catalog2')) {
        store.createSlice('catalog2', 'catalog');
      }

      await Promise.all([
        store.actions.catalog.initParams(),
        store.actions.categories.load(),
        store.actions.countries.load(),
      ]);
    },
    [],
    true,
  );

  const handleUpdateArticle = (id: string, article: IArticle) => {
    store.actions.catalog.updateArticle(id, article);
  };

  const handleDeleteArticle = (id: string) => {
    store.actions.catalog.deleteArticle(id);
  };

  return (
    <Row
      gutter={[0, 16]}
      style={{ flexDirection: 'column' }}
    >
      <Typography.Title
        level={2}
        style={{ margin: 0, width: '100%' }}
      >
        Articles
      </Typography.Title>

      <AdminCatalogFilter />
      <AdminCatalogArticles
        onEditArticle={handleUpdateArticle}
        onDeleteArticle={handleDeleteArticle}
      />
    </Row>
  );
};

export default AdminArticles;
