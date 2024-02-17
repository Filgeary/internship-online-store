import React, { useEffect } from 'react';

type TUseOnClickOutside = (
  ref: React.RefObject<any>,
  options: { closeByEsc: boolean },
  ...handlers: Array<() => void>
) => void;

const useOnClickOutside: TUseOnClickOutside = (ref, { closeByEsc }, ...handlers) => {
  useEffect(() => {
    const runHandlers = () => handlers.forEach((handler) => handler());

    const listener = (e: Event) => {
      // if (e.currentTarget === e.target) {
      //   runHandlers();
      // }

      //@ts-ignore
      if (!ref.current.contains(e.target)) {
        runHandlers();
      }
    };

    const keyListener = (e: KeyboardEvent) => {
      if (!closeByEsc) return;

      const escCode = 27;

      if (e.keyCode === escCode) {
        runHandlers();
      }
    };

    document.addEventListener('pointerdown', listener);
    document.addEventListener('keydown', keyListener);

    return () => {
      document.removeEventListener('pointerdown', listener);
      document.addEventListener('keydown', keyListener);
    };
  }, [ref, handlers]);
};

export default useOnClickOutside;
