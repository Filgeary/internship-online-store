import { useRef, useState, useEffect } from "react";
import { IСountry } from "../store/countries/types";
import useStore from "@src/hooks/use-store"

export default function useSelectCustom(countries: IСountry[], isOpen: boolean) {

  const store = useStore()
  const [selectedIndex, setSelectedIndex] = useState<null | number>(null);
  const selectorRef = useRef(null);
  const selected = useRef<string[]>([]) as unknown

  let index = 0;

  const handleKeyDown = (e: KeyboardEvent) => {
    // Стрелка вверх
    if (e.key === "ArrowUp" && index > 0) {
      --index;
      setSelectedIndex(index);
      scrollSelectedItem("up");
    }

    // Стрелка вниз
    if (e.key === "ArrowDown" && index !== countries.length - 1) {
      ++index;
      setSelectedIndex(index);

      if(index > 3) scrollSelectedItem("down")
    }

    // Enter
    if (e.key === "Enter") {
      let list = selectorRef.current as any

      if (list !== null) {
        const id = countries[index]._id
        // selectedItem.style.backgroundColor = "#808DFF";
        const selectedId = selected as React.MutableRefObject<string[]>
        const selectedElement = document.getElementById(String(index))
        
        if(!selectedId.current.includes(id)) {
          selectedId.current = [...selectedId.current, id]
          if(selectedElement)  {
            selectedElement.style.backgroundColor = "#808DFF"
            selectedElement.style.borderBottom = "1px solid #eaeaec"
          }
        } else {
          selectedId.current = selectedId.current.filter(item => item !== id)
          if(selectedElement)  {
            selectedElement.style.backgroundColor = "#FFFFFF"
            selectedElement.style.borderBottom = "1px solid #FFFFFF"
          }
        }
         
        const params = selectedId.current.join('|')
        store.actions.catalog.setParams({ madeIn: params, page: 1 }, false, false)
      }
    }
  };
  const scrollSelectedItem = (direction: string) => {
    const list = selectorRef.current as any;
    const padding = 5;

    if (list !== null) {
      const selectedItem = list.querySelector(".Select-layout-item");
      if (!selectedItem) {
        return;
      }
      const selectorRect = list.getBoundingClientRect(); // границы списка
      const selectedItemRect = selectedItem.getBoundingClientRect(); // границы выделенной страны

      if (direction === "up" && selectedItemRect.top < selectorRect.top + 10) {
        list.scrollTop -= selectedItemRect.height;
      }

      if (direction === "down") {
        if (selectedItemRect.top === selectorRect.top + padding) {
          list.scrollTop += selectedItemRect.height;
          // selectedItem.style.backgroundColor = 'rgba(219, 223, 255, 1)'
        } else {
          if (index !== countries.length - 1) {
            list.scrollTop += selectedItemRect.height;
          }
        }
      }
    }
  };

  const handleMouseEnter = () => {
    setSelectedIndex(null) 
  }

  useEffect(() => {
    if (isOpen && countries.length > 0) {
      document.addEventListener("keydown", handleKeyDown);
    }
    const countriesCurrent = selectorRef.current as unknown
    const countriesRef = countriesCurrent as HTMLElement
    countriesRef && countriesRef.addEventListener('mouseenter', handleMouseEnter)

  }, [isOpen]);

  return { selectedIndex, selectorRef, setSelectedIndex, handleKeyDown, handleMouseEnter };
}
