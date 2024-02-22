import { useRef, useState, useEffect } from "react";
import { IСountry } from "../store/countries/types" 

export default function useSelectCustom(select: IСountry[], isOpen: boolean) {
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectorRef = useRef(null);

  let index = 0;

  const handleKeyDown = (e: KeyboardEvent) => {
    // Стрелка вверх
    if (e.key === "ArrowUp" && index > 0) {
      --index;
      setSelectedIndex(index);
      scrollSelectedItem("up");
    }

    // Стрелка вниз
    if (e.key === "ArrowDown" && selectedIndex < select.length - 1) {
      ++index;
      setSelectedIndex(index);
      scrollSelectedItem("down");
    }
  };

  const scrollSelectedItem = (direction: string) => {
    const selector = selectorRef.current as any;

    if (selector !== null) {
      const selectedItem = selector.querySelector(
        ".Select-layout-item"
      );
      if (!selectedItem) {
        return;
      }

      const selectorRect = selector.getBoundingClientRect(); // границы списка
      const selectedItemRect = selectedItem.getBoundingClientRect(); // границы выделенной страны

      if (direction === "up" && selectedItemRect.top < selectorRect.top + 15) {
        selector.scrollTop -= selectedItemRect.height;
      }

      if (
        direction === "down" &&
        selectedItemRect.bottom <= selectorRect.bottom - 10
      ) {
        selector.scrollTop += selectedItemRect.height;
        selectedItem.style.backgroundColor = 'rgba(219, 223, 255, 1)';
      }
    }
  };

  useEffect(() => {
    if (isOpen && select.length > 0)
      document.removeEventListener("keydown", handleKeyDown);

    return document.addEventListener("keydown", handleKeyDown);
  }, [isOpen]);
  
  return {selectedIndex, selectorRef, setSelectedIndex};
}
