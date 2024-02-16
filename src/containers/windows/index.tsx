import React, { memo } from "react";
import { useSelector as useSelectorRedux } from 'react-redux';
import Basket from "@src/app/basket";
import AddProduct from "@src/app/add-product";
import shallowequal from "shallowequal";
import AddManyProducts from "@src/app/add-many-propducts";
import StateFork from "@src/app/state-fork";
import { EContext } from "@custom-types/context";


function Windows() {
  const select = useSelectorRedux(state => ({
    activeModal: (state as any).modals.name, // TODO: посмотреть как типизировать стейт для редакса
    dialogsArray: (state as any).dialogs.dialogs,
  }), shallowequal);

  // Вспомогательная функция: просто чтобы меньше длинного бойлерплейта было
  const checkWindowsName = (dialog: Record<string, unknown>) => (name: string) => dialog.name === name;

  const dialogs = select.dialogsArray.length > 0;

  return (
    <>
      {/* Контекст нужен для открываемого диалогового окна */}
      {select.activeModal === 'basket' && <Basket context={EContext.addMoreToBasket} />}

      {dialogs && select.dialogsArray.map((dialog: Record<string, unknown>, index: number) => {
        const is = checkWindowsName(dialog);
        return (
          <React.Fragment key={dialog._id as string}>
            { is(EContext.addToBasket) && <AddProduct context={EContext.addToBasket} indent={index} /> }
            { is(EContext.addToSelected) && <AddProduct context={EContext.addToSelected} indent={index} /> }
            {/* StateFork отображает компоненты только после того, как форк среза стора для них успешно создан */}
            {is(EContext.addMoreToBasket) && (
              <StateFork name={EContext.addMoreToBasket} parent='catalog'>
                <AddManyProducts context={EContext.addMoreToBasket} theme='big' indent={index} />
              </StateFork>
            )}
          </React.Fragment>
        )
      })}
    </>
  );
}

export default memo(Windows);
