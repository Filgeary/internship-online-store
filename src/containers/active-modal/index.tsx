import { memo, useCallback } from "react";
import * as modals from "@src/app/export-modals";
import useSelector from "@src/hooks/use-selector";
import useStore from "@src/hooks/use-store";

function ActiveModal() {
  const store = useStore();

  const activeModals = useSelector((state) => state.modals.list);

  // switch (activeModal) {
  //   case 'basket':
  //     return <Basket/>
  //   case 'counter-modal':
  //     return <CounterModal/>
  //   default:
  //     return <></>
  // }

  const callbacks = {
    closeModal: useCallback((_id: string, result: unknown) => {
        store.actions.modals.close(_id, result);
      },
      [store]
    ),
  };

  return (
    <>
      {activeModals.map((activeModal) => {
        if (activeModal.name in modals) {
          const RenderModal = modals[activeModal.name];
          return (
            <RenderModal
              key={activeModal.id}
              closeModal={(result) =>
                callbacks.closeModal(activeModal.id, result)
              }
            />
          );
        }
      })}
    </>
  );
}

ActiveModal.propTypes = {};

export default memo(ActiveModal);
