import { memo, useMemo } from "react";
import AmountDialog from "../amount-dialog";
import Basket from "../basket";
import SelectItemsModal from "../select-items-modal";
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";

function Modals() {
  const modalStack = useSelector(state => state.modals.stack)
  const store = useStore()

  console.log(modalStack)

  const modals = useMemo(() => ({
    [store.actions.modals.types.basket]: Basket,
    [store.actions.modals.types.amount]: AmountDialog,
    [store.actions.modals.types.selectItems]: SelectItemsModal,
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