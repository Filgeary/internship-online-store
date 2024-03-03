import excludeArray from '@src/utils/exclude-array';
import { TMessage } from '../types';

function excludeExistingMessages(arr1: TMessage[], arr2: TMessage[]): TMessage[] {
  const res = excludeArray(arr1, arr2, (obj1: TMessage[], obj2: TMessage[]) => {
    const keys = Object.keys(obj1);

    for (const key of keys) {
      const val1 = obj1[key as keyof TMessage[]];
      const val2 = obj2[key as keyof TMessage[]];

      // Для null
      if (val1 === val2) continue;

      // Для вложенных объектов, их сравнивать вглубь не будем
      if (typeof val1 === 'object' && typeof val2 === 'object') continue;
      if (val1 !== val2) return false;
    }

    return true;
  });

  return res;
}

export default excludeExistingMessages;
