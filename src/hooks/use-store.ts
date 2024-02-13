import useServices from "./use-services";

export default function useStore() {
  return useServices().store;
}
