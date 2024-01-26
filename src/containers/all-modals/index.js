import { useSelector } from "react-redux";

import Basket from "@src/app/basket";
import CountToAdd from "@src/containers/count-to-add";

function AllModals() {
  const activeModal = useSelector(state => state.modals.name);

  return (
    <>
      {activeModal === 'basket' && <Basket />}
      {activeModal === 'countToAdd' && <CountToAdd />}
    </>
  );
}

export default AllModals;
