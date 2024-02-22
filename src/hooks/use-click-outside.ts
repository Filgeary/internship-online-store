import { useEffect, useRef } from "react";

export const useClickOutside = <T extends HTMLElement>(callback: () => void) => {
  const ref = useRef<T>(null);
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const { target } = event;
      if (
        target instanceof Node &&
        ref.current &&
        !ref.current.contains(target)
      ) {
        callback();
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return ref;
};
