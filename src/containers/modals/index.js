import { memo } from "react";
import useSelector from "@src/hooks/use-selector";
import Basket from "../../app/basket";
import CountItemModal from "@src/containers/count-item-modal";

function Modals() {
  const activeModal = useSelector((state) => state.modals.name);

  return (
    <>
      {activeModal === "basket" && <Basket />}
      {activeModal ===  "count" && <CountItemModal />}
    </>
  );
}

export default memo(Modals);
