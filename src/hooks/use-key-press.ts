import { useEffect } from "react";

function useKeyPress(callback: () => void, keys: string[]) {
  const downHandler = (e: KeyboardEvent) => {
    const wasAnyKeyPressed = keys.some((key) => e.key === key);
    if (wasAnyKeyPressed) {
      e.preventDefault();
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
    };
  }, [downHandler]);
}

export default useKeyPress;
