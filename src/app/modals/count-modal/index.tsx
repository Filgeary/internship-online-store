import { memo, useCallback, useState } from "react";
import {
  useDispatch,
  useStore as useStoreRedux,
  useSelector as useSelectorRedux,
} from "react-redux";
import useStore from "@src/hooks/use-store";

import useTranslate from "@src/hooks/use-translate";

import ModalLayout from "@src/components/modal-layout";
import modalsActions from "@src/store-redux/modals/actions";
import CountPicker from "@src/components/count-picker";
import { ModalProps } from "../types";

function CountModal({ title, onTop, id }: ModalProps) {
  const store = useStore();
  const dispatch = useDispatch();

  const resolve = useSelectorRedux(
    (state: any) =>
      state.modals.activeModals.find((el: any) => el.id === id).resolve
  );

  const [count, setCount] = useState(1);

  const callbacks = {
    onAdd: () => {
      resolve(count);
    },
    // Закрытие любой модалки
    onCancel: useCallback(() => {
      //store.actions.modals.close();
      dispatch(modalsActions.close(id));
      // onCancel();
    }, [store]),
    // Увеличить количество
    addCount: () => {
      setCount((count) => count + 1);
    },
    // Уменьшить количество
    removeCount: () => {
      if (count > 1) {
        setCount((count) => count - 1);
      }
    },
  };

  //@ts-ignore
  const { t } = useTranslate();

  return (
    <ModalLayout
      title={t("count.title")}
      labelClose={t("count.cancel")}
      onClose={callbacks.onCancel}
      onTop={onTop}
    >
      {/* @ts-ignore  */}
      <CountPicker callbacks={callbacks} t={t} count={count} title={title} />
    </ModalLayout>
  );
}

export default memo(CountModal);
