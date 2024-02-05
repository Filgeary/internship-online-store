import useStore from "./use-store";
import useSelector from "./use-selector";

/**
 * Хук для выборки функции закрытия родительского модального окна
 * @param id {string} 
 * @returns {Function}
 */
function useCloseParentFn(id: string): () => void {
  const store = useStore();
  const activeModals = useSelector((state: any) => state.modals.mapOfOpened);
  const modalsIds = Reflect.ownKeys(activeModals) as string[];

  for (let i = 1; i < modalsIds.length; i++) {
    if (modalsIds[i] === id) {
      return () => store.actions.modals.closeById(modalsIds[i-1], null, false);
    }
  }

  return () => {};
}

export default useCloseParentFn;
