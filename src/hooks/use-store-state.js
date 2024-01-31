import { useSyncExternalStore } from "react";
import useStore from "./use-store";

function useStoreState(name) {
  // const stateModule = useServices().store.modules[name];
  const stateModule = useStore().actions[name];
  
  console.log('@', name);
  console.log('@@@', stateModule);

  return stateModule.getState();
}

export default useStoreState;
