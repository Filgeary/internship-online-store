import { memo } from 'react';

import Basket from '@src/containers/basket';
import DialogAmount from '@src/containers/dialog-amount';
import modalCatalog from '@src/containers/modal-catalog';
import useSelector from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';

const modalsMap = {
  basket: Basket,
  dialogAmount: DialogAmount,
  modalCatalog: modalCatalog,
};

const Modals = () => {
  const store = useStore();

  const select = useSelector(state => ({
    modals: state.modals.data,
  }));

  const handleCloseModal =
    (id: string | number) =>
    (data: any, modalID = id) =>
      store.actions.modals.close(modalID, data);

  return (
    <>
      {select.modals.map(({ name, id }) => {
        const Modal = modalsMap[name];

        return (
          <Modal
            key={name + id}
            onClose={handleCloseModal(id)}
          />
        );
      })}
    </>
  );
};

export default memo(Modals);
