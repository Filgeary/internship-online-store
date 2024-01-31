import { memo, Fragment } from "react";
import useSelector from "@src/hooks/use-selector";
import Basket from "../../app/basket";
import CountItemModal from "@src/containers/count-item-modal";
import ModalCatalog from "../modal-catalog";

function Modals() {
  const activeModals = useSelector((state) => state.modals.list);

  const modals = (name) => {
    switch (name) {
      case "basket":
        return <Basket />;
      case "count":
        return <CountItemModal />;
      case "catalog":
        return <ModalCatalog />;
    }
  };

  return (
    <>
      {!!activeModals.length && activeModals.map((modal) => {
        return <Fragment key={modal}>{modals(modal)}</Fragment>;
      })}
    </>
  );
}

export default memo(Modals);
