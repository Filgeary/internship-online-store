import React, { useEffect } from 'react';

function useOnClickOutside(
  ref: React.RefObject<any>,
  ...handlers: (() => void)[]
) {
  useEffect(() => {
    const runHandlers = () => handlers.forEach((handler) => handler());

    const listener = (e: Event) => {
      if (e.currentTarget === e.target) {
        runHandlers();
      }
    };

    const keyListener = (e: KeyboardEvent) => {
      const escCode = 27;

      if (e.keyCode === escCode) {
        runHandlers();
      }
    };

    ref.current.addEventListener('pointerdown', listener);
    ref.current.addEventListener('keydown', keyListener);

    return () => {
      ref.current?.removeEventListener('pointerdown', listener);
      ref.current?.addEventListener('keydown', keyListener);
    };
  }, [ref, handlers]);
}

export default useOnClickOutside;
