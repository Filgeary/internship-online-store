import { memo } from "react";

import Basket from "@src/containers/basket";
import DialogAmount from "@src/containers/dialog-amount";
import useSelector from "@src/hooks/use-selector";

const modalsMap = {
  basket: Basket,
  dialogAmount: DialogAmount,
};

const Modals = () => {
  const select = useSelector((state) => ({
    modals: state.modals.data,
  }));

  return (
    <>
      {select.modals.map(({ name }) => {
        const Modal = modalsMap[name];

        return <Modal key={name} />;
      })}
    </>
  );
};

export default memo(Modals);
