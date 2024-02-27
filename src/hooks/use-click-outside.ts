import { useEffect } from "react";

/**
 * Хук для обработки нажатия вне элемента
 */
export default function useClickOutside(ref: React.RefObject<HTMLElement>, callback: () => unknown) {
  // Отслеживание нажатия вне customSelect
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };
    document.addEventListener("click", onClickOutside, true);
    return () => document.removeEventListener("click", onClickOutside, true);
  }, [ref]);
}
