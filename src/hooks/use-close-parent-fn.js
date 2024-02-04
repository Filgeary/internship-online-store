import useStore from "./use-store";
import useSelector from "./use-selector";

function useCloseParentFn(id) {
  const store = useStore();
  const activeModals = useSelector((state) => state.modals.mapOfOpened);
  const modalsIds = Object.keys(activeModals);

  const closeParentsFunctions = {};

  for (let i = 1; i < modalsIds.length; i++) {
    closeParentsFunctions[modalsIds[i]] = () => store.actions.modals.closeById(modalsIds[i-1], null, false);
  }

  return closeParentsFunctions[id];
}

export default useCloseParentFn;
