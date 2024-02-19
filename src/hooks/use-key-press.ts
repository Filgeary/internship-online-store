import { useEffect, useState } from "react";

function useKeyPress(targetKey: string) {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = (e: KeyboardEvent) => {
    if (e.key === targetKey) {
      e.preventDefault();
      setKeyPressed(true);
    }
  };

  const upHandler = (e: KeyboardEvent) => {
    if (e.key === targetKey) {
      e.preventDefault();
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []);

  return keyPressed;
}

export default useKeyPress;
