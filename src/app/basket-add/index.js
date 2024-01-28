import ModalLayout from "@src/components/modal-layout";
import { useCallback } from "react";
import { memo } from "react"
import { useDispatch, useSelector } from "react-redux";
import modalsActions from '@src/store-redux/modals/actions';
import addingActions from '@src/store-redux/adding/actions';
import useStore from "@src/hooks/use-store";
import ItemAdd from "@src/components/item-add";
import useTranslate from "@src/hooks/use-translate";
import shallowequal from "shallowequal";

function BasketAdd() {
  const store = useStore();
  const dispatch = useDispatch();
  const {t} = useTranslate();

  const select = useSelector( state => ({
    count: state.adding.count,
    title: state.adding.title
  }),  shallowequal)

  const callbacks = {
    closeAdding: useCallback(() => {
      dispatch(modalsActions.close());
      dispatch(addingActions.close());
    }, [store]),

    setArticleCount: useCallback((count) => {
      dispatch(addingActions.set(count));
      dispatch(modalsActions.close());
    }, [store]),
  }

  return (
    <ModalLayout title={t("adding.title")}
                 labelClose={t("adding.cancel")}
                 onClose={callbacks.closeAdding}>
      <ItemAdd setCount={callbacks.setArticleCount}
               btnTitle={t("adding.ok")}
               initial={select.count}
               title={select.title}/>
    </ModalLayout>
  )
}

export default memo(BasketAdd);
