import useServices from "./use-services";

/**
 * Хук для доступа к сервису modal
 * @return {Modal}
 */
export default function useModal() {
  return useServices().modal;
}
