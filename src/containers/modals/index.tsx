import Basket from "@src/app/basket";
import useStore from "@src/hooks/use-store";
import { memo, useCallback } from "react";
import { useDispatch } from "react-redux";
import modalsActions from "@src/store-redux/modals/actions";
import { useSelector as useSelectorRedux } from "react-redux";
import CatalogModal from "@src/containers/catalog-modal";
import CountModal from "../count-modal";

export type TCloseModal={
  closeModal: (name: string, data: {} | number | null) => void;
}
const Modals = () => {
  const activeModal = useSelectorRedux((state: any) => state.modals);
  const dispatch = useDispatch();
  const store = useStore();

  const callbacks = {
    // Закрытие модалки
    closeModal: useCallback(
      (name: string, data: {} | number | null) => {
        dispatch(modalsActions.close(name, data));
      },
      [store]
    ),
  };
  return (
    <>
      {activeModal.list.map((el: string) => {
        switch (el) {
          case "basket":
            return <Basket closeModal={callbacks.closeModal} key={el} />;
          case "counter":
            return <CountModal closeModal={callbacks.closeModal} key={el} />;
          case "catalog":
            return <CatalogModal closeModal={callbacks.closeModal} key={el} />;
        }
      })}
    </>
  );
};

export default memo(Modals);
