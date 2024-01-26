import { useEffect } from 'react';

function useOnClickOutside(ref, ...handlers) {
  useEffect(() => {
    const runHandlers = () => handlers.forEach((handler) => handler());

    const listener = (e) => {
      // Клик был внутри
      if (!ref.current || ref.current?.contains(e.target)) {
        return;
      }

      runHandlers();
    };

    const keyListener = (e) => {
      const escCode = 27;

      if (e.keyCode === escCode) {
        runHandlers();
      }
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    document.addEventListener('keydown', keyListener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);

      document.removeEventListener('keydown', keyListener);
    };
  }, [ref, handlers]);
}

export default useOnClickOutside;
