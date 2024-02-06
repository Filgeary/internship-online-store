import { useSelector as useSelectorRedux } from "react-redux";
import { createElement } from "react";
import catalogListModal from "./catalog-list-modal";
import countModal from "./count-modal";
import basket from "./basket";

const modalsList = {
  basket: basket,
  "count-picker": countModal,
  "catalog-list-modal": catalogListModal,
};

function Modals() {
  const activeModals = useSelectorRedux((state) => state.modals.activeModals);

  return activeModals.map((modal, i, arr) => {
    return createElement(modalsList[modal.name], {
      onTop: i === arr.length - 1,
      id: modal.id,
    });
  });
}

export default Modals;
