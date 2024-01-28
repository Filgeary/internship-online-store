import {memo} from "react";
import { useSelector } from "react-redux";
import CounterModal from "@src/app/counter-modal";
import Basket from "@src/app/basket";

function ActiveModal() {

  const activeModal = useSelector(state => state.modals.name);

  switch (activeModal) {
    case 'basket':
      return <Basket/>
    case 'counter-modal':
      return <CounterModal/>  
    default:
      return <></>
  }
}

ActiveModal.propTypes = {}

export default memo(ActiveModal);
