import useServices from './use-services';

import Store from '@src/store';

/**
 * Хук для доступа к объекту хранилища
 * @return {Store}
 */
export default function useStore(): Store {
  return useServices().store;
}
