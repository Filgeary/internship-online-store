import { memo } from 'react';

import EditModal from '@src/components/edit-modal';
import FormEditArticle from '@src/components/form-edit-article';
import FormEditCity from '@src/components/form-edit-city';
import { TCity } from '@src/store/admin/types';
import { TCatalogArticle } from '@src/store/catalog/types';

import { useAdminContext } from '..';

function AdminModals() {
  const { select, handlers, options, callbacks, values } = useAdminContext();

  return (
    <>
      <EditModal
        title={'Изменение товара'}
        isOpen={options.isModalEditArticleActive}
        isBtnsDisabled={select.activeArticleFetching}
        onCancel={callbacks.closeModalEditArticle}
        onOk={callbacks.editArticle}
      >
        <FormEditArticle
          data={values.activeArticle || ({} as TCatalogArticle)}
          onChange={handlers.onActiveArticleChange}
        />
      </EditModal>

      <EditModal
        title={'Изменение города'}
        isOpen={options.isModalEditCityActive}
        isBtnsDisabled={select.activeCityFetching}
        onCancel={callbacks.closeModalEditCity}
        onOk={callbacks.editCity}
      >
        <FormEditCity
          data={values.activeCity || ({} as TCity)}
          onChange={handlers.onActiveCityChange}
        />
      </EditModal>
    </>
  );
}

export default memo(AdminModals);
