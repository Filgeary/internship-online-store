import CountModal from "@src/containers/count-modal";
import Basket from "../basket";
import { useSelector as useSelectorRedux } from "react-redux";
import { createElement } from "react";
import CatalogListModal from "@src/containers/catalog-list-modal";

const modalsList = {
  basket: Basket,
  "count-picker": CountModal,
  "catalog-list-modal": CatalogListModal,
};

function Modals() {
  const activeModals = useSelectorRedux((state) => state.modals.activeModals);

  return activeModals.map((modal, i, arr) => {
    return createElement(modalsList[modal.name], {
      onTop: i === arr.length - 1,
    });
  });
}

export default Modals;
