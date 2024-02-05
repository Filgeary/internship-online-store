import {memo} from "react";
import {useSelector as useSelectorRedux} from "react-redux";
import Basket from "@src/app/modals/basket";
import GoodsQuantity from "@src/app/modals/goods-quantity";
import Goods from "@src/app/modals/goods";

function Modals() {

  const namesModal = useSelectorRedux(state => state.modals.modals);

  return (
    <>
    {namesModal.map((item, index) => (
      <div key={index}>
        {item.name === 'basket' && <Basket/>}
        {item.name === 'quantity' && <GoodsQuantity/>}
        {item.name === 'goods' && <Goods/>}
      </div>
    ))}
    </>
  )
}

export default memo(Modals);