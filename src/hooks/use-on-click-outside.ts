import React, { useEffect } from 'react';

function useOnClickOutside(ref: React.RefObject<any>, ...handlers: (() => void)[]) {
  useEffect(() => {
    const runHandlers = () => handlers.forEach((handler) => handler());

    const listener = (e: Event) => {
      if (e.currentTarget === e.target) {
        runHandlers();
      }
    };

    // const keyListener = (e) => {
    //   const escCode = 27;

    //   if (e.keyCode === escCode) {
    //     runHandlers();
    //   }
    // };

    ref.current.addEventListener('click', listener);
    ref.current.addEventListener('touchstart', listener);

    // document.addEventListener('keydown', keyListener);
    
    return () => {
      ref.current?.removeEventListener('click', listener);
      ref.current?.removeEventListener('touchstart', listener);

      // document.addEventListener('keydown', keyListener);
    };
  }, [ref, handlers]);
}

export default useOnClickOutside;
