import Store from "@src/store";
import useServices from "./use-services";

/**
 * Хук для доступа к объекту хранилища
 * @return {Store}
 */
export default function useStore(): Store {
  return useServices().store;
}
