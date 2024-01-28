import {memo} from "react";
import {useSelector as useSelectorRedux} from "react-redux";
import Basket from "@src/app/modals/basket";
import GoodsQuantity from "@src/app/modals/goods-quantity";

function Modals() {

  const activeModal = useSelectorRedux(state => state.modals.name);

  return (
    <>
      {activeModal === 'basket' && <Basket/>}
      {activeModal === 'quantity' && <GoodsQuantity/>}
    </>
  )
}

export default memo(Modals);