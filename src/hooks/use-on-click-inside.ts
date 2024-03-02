import React, { useEffect } from 'react';

type TUseOnClickInside = (
  ref: React.RefObject<any>,
  options: { triggerByEsc: boolean },
  ...handlers: Array<() => void>
) => void;

const useOnClickInside: TUseOnClickInside = (ref, { triggerByEsc }, ...handlers) => {
  useEffect(() => {
    const runHandlers = () => handlers.forEach((handler) => handler());
    const refNode = ref.current;

    const listener = (e: Event) => {
      if (e.target === refNode) {
        runHandlers();
      }
    };

    const keyListener = (e: KeyboardEvent) => {
      if (!triggerByEsc) return;

      const escCode = 27;

      if (e.keyCode === escCode) {
        runHandlers();
      }
    };

    refNode?.addEventListener('pointerdown', listener);
    refNode?.addEventListener('keydown', keyListener);

    return () => {
      refNode?.removeEventListener('pointerdown', listener);
      refNode?.removeEventListener('keydown', keyListener);
    };
  }, [ref, handlers]);
};

export default useOnClickInside;
