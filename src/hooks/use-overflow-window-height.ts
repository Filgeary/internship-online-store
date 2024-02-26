import { useLayoutEffect, useState } from 'react';

export const useOverflowWindowHeight = (ref: React.RefObject<any>, deps: any[], minHeight = 0) => {
  const [refCoords, setRefCoords] = useState({
    isOverflow: false,
    derivedHeight: 0,
  });

  // listen deps & set ref height
  useLayoutEffect(() => {
    const { top = 0, height = 0 } = ref.current?.getBoundingClientRect() ?? {};

    setRefCoords({
      isOverflow: window.innerHeight - (top + Math.max(height, minHeight)) < 0,
      derivedHeight: Math.max(height, minHeight),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    ...refCoords,
  };
};
