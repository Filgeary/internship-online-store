import { useCallback } from "react";
import { memo } from "react"
import useStore from "../../hooks/use-store";
import ItemAdd from "../../components/item-add";
import useTranslate from "../../hooks/use-translate";
import { BasketAddPropsType } from "./types";
import ModalLayout from "../../components/modal-layout";

function BasketAdd({close, title, count}: BasketAddPropsType) {
  const store = useStore();
  const {t} = useTranslate();

  const callbacks = {
    closeAdding: useCallback(() => close(), [store]),
    setArticleCount: useCallback((value: number) => close(value), [store]),
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
