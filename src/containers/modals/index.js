import Basket from "@src/app/basket";
import BasketAdd from "@src/app/basket-add";
import useInit from "@src/hooks/use-init";
import { memo, useState } from "react"
import { useSelector } from "react-redux";

function Modals() {
  const [modal, setModal] = useState(null);
  const activeModal = useSelector(state => state.modals.name);

  useInit(() => {
    switch (activeModal) {
      case "basket":
        setModal(<Basket />);
        return;
      case "addToBasket":
        setModal(<BasketAdd />);
        return;
      default:
        setModal(null);
        return;
    }
  }, [activeModal])

  return (
    <>
      {modal}
    </>
  )
}

export default memo(Modals);
