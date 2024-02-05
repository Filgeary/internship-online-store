import React, { memo } from "react";
import { useSelector as useSelectorRedux } from 'react-redux';
import Basket from "@src/app/basket";
import AddProduct from "@src/app/add-product";
import shallowequal from "shallowequal";
import AddManyProducts from "@src/app/add-many-propducts";
import StateFork from "@src/app/state-fork";

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
      {/* Контекст нужен для открываемого диалогового окна */}
      {select.activeModal === 'basket' && <Basket context={'add-more-to-basket'} />}

      {dialogs && select.dialogsArray.map((dialog, index) => {
        const is = checkWindowsName(dialog);
        return (
          <React.Fragment key={dialog._id}>
            { is('add-to-basket') && <AddProduct context={'add-to-basket'} indent={index} /> }
            { is('add-to-selected') && <AddProduct context={'add-to-selected'} indent={index} /> }
            {/* StateFork отображает компоненты только после того, как форк среза стора для них успешно создан */}
            {is('add-more-to-basket') && (
              <StateFork name={'add-more-to-basket'} parent='catalog'>
                <AddManyProducts context={'add-more-to-basket'} theme='big' indent={index} />
              </StateFork>
            )}
          </React.Fragment>
        )
      })}
    </>
  );
}

export default memo(Windows);
