import { Fragment } from "react";
import useSelector from "@src/hooks/use-selector";
import Basket from "../../app/basket";
import CountItemModal from "@src/containers/count-item-modal";
import ModalCatalog from "../modal-catalog";
import { ModalsName } from "@src/store/modals/type";
import { ModalCreateProduct } from "@src/admin/layout/modal-create";
import { ModalEdit } from "@src/admin/layout/modal-edit";

function Modals() {
  const activeModals = useSelector((state) => state.modals.list);

  const modals = (name: ModalsName) => {
    switch (name) {
      case "basket":
        return <Basket />;
      case "count":
        return <CountItemModal />;
      case "catalog_modal":
        return <ModalCatalog />;
      case "add_product":
        return <ModalCreateProduct />;
      case "edit_product":
        return <ModalEdit />;
    }
  };

  return (
    <>
      {!!activeModals.length && activeModals.map(({name, id}) => {
        return <Fragment key={id}>{modals(name)}</Fragment>
      })}
    </>
  );
}

export default Modals;
