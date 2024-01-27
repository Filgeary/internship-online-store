import { useSelector as useSelectorRedux } from "react-redux";
import { memo } from "react";
import Basket from "../basket";
import CountItemModal from "@src/containers/count-item-modal";

function Modals() {
  const activeModal = useSelectorRedux((state) => state.modals.name);

  return (
    <>
      {activeModal === "basket" && <Basket />}
      {activeModal ===  "count" && <CountItemModal />}
    </>
  );
}

export default memo(Modals);
