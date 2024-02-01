import ModalLayout from "@src/components/modal-layout";
import { useCallback } from "react";
import { memo } from "react"
import useStore from "@src/hooks/use-store";
import ItemAdd from "@src/components/item-add";
import useTranslate from "@src/hooks/use-translate";

function BasketAdd({close, title, count}) {
  const store = useStore();
  const {t} = useTranslate();

  const callbacks = {
    closeAdding: useCallback(() => close(), [store]),
    setArticleCount: useCallback((count) => close(count), [store]),
  }

  return (
    <ModalLayout title={t("adding.title")}
                 labelClose={t("adding.cancel")}
                 onClose={callbacks.closeAdding}>
      <ItemAdd setCount={callbacks.setArticleCount}
               btnTitle={t("adding.ok")}
               initial={count}
               title={title}/>
    </ModalLayout>
  )
}

export default memo(BasketAdd);
