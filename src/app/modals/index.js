import useModalsStack from "@src/hooks/use-modals-stack";
import { memo, useMemo } from "react";
import AmountDialog from "../amount-dialog";
import Basket from "../basket";
import useModal from "@src/hooks/use-modal";
import SelectItemsModal from "../select-items-modal";
import pageModal from "../page-modal";

function Modals() {
  const modal =  useModal()
  const modalStack = useModalsStack()

  const modals = useMemo(() => ({
    [modal.types.basket]: Basket,
    [modal.types.amount]: AmountDialog,
    [modal.types.selectItems]: SelectItemsModal,
    [modal.types.page]: pageModal,
  }), [])

  return modalStack && modalStack.map((m,i) => {
    const ModalComponent = modals[m.type]
    return <ModalComponent background={(i + 1) === modalStack.length} 
                           id={m._id} 
                           key={m._id} 
                           extraData={m.extraData}/>
  })
}

export default memo(Modals)