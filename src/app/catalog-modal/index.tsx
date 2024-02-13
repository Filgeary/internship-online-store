import Button from "../../components/button";
import ModalLayout from "../../components/modal-layout";
import CatalogFilter from "../../containers/catalog-filter";
import CatalogList from "../../containers/catalog-list";
import useInit from "../../hooks/use-init";
import useStore from "../../hooks/use-store";
import { memo, useCallback, useState } from "react"
import { CatalogModalPropsType } from "./types";


function CatalogModal({storeSlice = 'catalog', close}: CatalogModalPropsType<'catalog'>) {
  const store = useStore()
  const [articles, setArticles] = useState<string[]>([]);

  useInit(async () => {
    await store.actions[storeSlice].resetParams({}, false);
  }, [], true)

  const callbacks = {
    closeModal: useCallback(() => close(), []),
    addArticle: (id: string) => {
      let item = articles.find(item => item === id);
      if(item) {
        setArticles([...articles.filter(item => item !== id)]);
      } else {
        setArticles([...articles, id]);
      }
    },
    addArticlesToBasket: () => close(articles),
  }

  return (
      <ModalLayout title="Каталог товаров в модалке"
              labelClose="Закрыть"
              onClose={callbacks.closeModal}
      >
        <CatalogFilter isModal={true} storeSlice={storeSlice}/>
        <CatalogList isModal={true}
                     storeSlice={storeSlice}
                     onAdd={callbacks.addArticle}
                     selectedArticles={articles} />
        <Button title="Добавить товары в корзину" onClick={callbacks.addArticlesToBasket} />
      </ModalLayout>
  )
}

export default memo(CatalogModal);
