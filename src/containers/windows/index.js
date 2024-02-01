import React, { memo } from "react";
import { useSelector as useSelectorRedux } from 'react-redux';
import Basket from "@src/app/basket";
import AddProduct from "@src/app/add-product";
import shallowequal from "shallowequal";
import AddManyProducts from "@src/app/add-many-propducts";

function Windows() {
  const select = useSelectorRedux(state => ({
    activeModal: state.modals.name,
    dialogsArray: state.dialogs.dialogs,
  }), shallowequal);

  // Вспомогательная функция: просто чтобы меньше длинного бойлерплейта было
  const checkWindowsName = (dialog) => (name) => dialog.name === name;

  const dialogs = select.dialogsArray.length > 0;

  return (
    <>
      {select.activeModal === 'basket' && <Basket />}

      {dialogs && select.dialogsArray.map((dialog, index) => {
        const is = checkWindowsName(dialog);
        return (
          <React.Fragment key={dialog._id}>
            { is('add-to-basket') && <AddProduct context={'add-to-basket'} indent={index} /> }
            { is('add-to-selected') && <AddProduct context={'add-to-selected'} indent={index} /> }
            { is('add-more-to-basket') && <AddManyProducts context={'add-more-to-basket'} theme='big' indent={index} /> }
          </React.Fragment>
        )
      })}
    </>
  );
}

export default memo(Windows);
