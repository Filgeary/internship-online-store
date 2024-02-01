import Button from "@src/components/button";
import ModalLayout from "@src/components/modal-layout";
import CatalogFilter from "@src/containers/catalog-filter";
import CatalogList from "@src/containers/catalog-list";
import { memo, useCallback, useState } from "react"

function CatalogModal({close}) {
  const [articles, setArticles] = useState([]);

  const callbacks = {
    closeModal: useCallback(() => close(), []),
    addArticle: (id) => {
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
      <CatalogFilter />
      <CatalogList isModal={true} onAdd={callbacks.addArticle} selectedArticles={articles} />
      <Button title="Добавить товары в корзину" onClick={callbacks.addArticlesToBasket} />
    </ModalLayout>
  )
}

export default memo(CatalogModal);
