import { memo } from 'react';

import EditModal from '@src/components/edit-modal';
import FormEditArticle from '@src/components/form-edit-article';
import FormEditCity from '@src/components/form-edit-city';

import { useAdminContext } from '..';

import { TCity } from '@src/store/admin/types';
import { TCatalogArticle } from '@src/store/catalog/types';

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
          categories={select.categories}
          countries={select.countries}
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

      <EditModal
        title={'Добавление нового товара'}
        isOpen={options.isModalAddArticleActive}
        isBtnsDisabled={false}
        isSubmitDisabled={options.isSubmitDisabledAddArticleModal}
        submitText={'Добавить'}
        onCancel={callbacks.closeModalAddArticle}
        onOk={callbacks.addArticle}
      >
        <FormEditArticle
          data={values.articleToAdd || ({} as TCatalogArticle)}
          categories={select.categories}
          countries={select.countries}
          onChange={handlers.onArticleToAddChange}
        />
      </EditModal>

      <EditModal
        title={'Добавление нового города'}
        isOpen={options.isModalAddCityActive}
        isBtnsDisabled={false}
        isSubmitDisabled={options.isSubmitDisabledAddCityModal}
        submitText={'Добавить'}
        onCancel={callbacks.closeModalAddCity}
        onOk={callbacks.addCity}
      >
        <FormEditCity
          data={values.cityToAdd || ({} as TCity)}
          onChange={handlers.onCityToAddChange}
        />
      </EditModal>
    </>
  );
}

export default memo(AdminModals);
