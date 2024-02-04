import useStore from "./use-store";
import useSelector from "./use-selector";

/**
 * Хук для выборки функции закрытия родительского модального окна
 * @param id {Number} 
 * @returns {Function}
 */
function useCloseParentFn(id) {
  const store = useStore();
  const activeModals = useSelector((state) => state.modals.mapOfOpened);
  const modalsIds = Object.keys(activeModals);

  for (let i = 1; i < modalsIds.length; i++) {
    if (modalsIds[i] === id) {
      return () => store.actions.modals.closeById(modalsIds[i-1], null, false);
    }
  }

  return () => {};
}

export default useCloseParentFn;
