import useActiveModal from "@src/hooks/use-active-modal";
import { memo } from "react";
import AddToBasketDialog from "../add-to-basket-dialog";
import Basket from "../basket";
import useModal from "@src/hooks/use-modal";

function Modals() {
  const modal =  useModal()
  const activeModal = useActiveModal()
  switch (activeModal) {
    case modal.list.basket: return <Basket/>;
    case modal.list.addToBasket: return <AddToBasketDialog/>
    default: return null
  }
}

export default memo(Modals)