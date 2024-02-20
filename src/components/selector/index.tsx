import { ChangeEvent, memo, useState, KeyboardEvent, useRef, useEffect } from "react";
import { SelectorPropsType } from "./types";
import chevron from "./chevron.svg";
import SelectorItem from "../selector-item";
import styles from "./style.module.css";

function Selector(props: SelectorPropsType) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);

  const selectorRef = useRef(null);
  // Эффект для закрытия при клике вне области выпадающего меню
  useEffect(() => {
    const onClickOutside = (e: PointerEvent) => {
      if(selectorRef.current && !selectorRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener('click', onClickOutside, true);
    return () => document.removeEventListener('click', onClickOutside, true);

  }, [selectorRef])

  const itemRefs = useRef([]);
  const countries = props.options.filter(c => c.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()));

  const callbacks = {
    onSearchChange: (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.currentTarget.value);
      setHovered(null);
    },
    expand: () => {
      setIsExpanded(!isExpanded);
      setHovered(null);
      setSearch('');
    },
    onSelectionChange: (id: string) => {
      props.onChange(id);
      callbacks.expand();
    },
    onKeyboardExpand: (e: KeyboardEvent<HTMLDivElement>) => {
      if(e.key === 'Enter')
        callbacks.expand();
    },
    onKeyUp: (e: KeyboardEvent<HTMLDivElement>) => {
      if(e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.stopPropagation();
        if(e.key === 'ArrowDown' && hovered === null) {
          setHovered(countries[0]._id);
          return;
        }
        if(e.key === 'ArrowUp' && hovered === null) {
          setHovered(countries[props.options.length - 1]._id);
          itemRefs.current[countries.length - 1].scrollIntoView({ behavior: "smooth", block: "center", inline: "start" });
          return;
        }

        const currentItem = countries.findIndex(el => el._id === hovered);
        const nextItem = e.key === 'ArrowDown' ? countries[currentItem + 1] : countries[currentItem - 1]
        if(nextItem) {
          setHovered(nextItem._id);
          itemRefs.current[currentItem].scrollIntoView({ behavior: "smooth", block: "center", inline: "start" });
          return;
        }
      }
      if(e.key === 'Escape') callbacks.expand();
      if(e.key === 'Enter' && hovered !== null) callbacks.onSelectionChange(hovered);
    }
  };

  const selectedCountry = props.options.find(c => c._id === props.selected) || props.options[0];

  return (
    <div ref={selectorRef}>
      <div className={styles.Selector} onClick={callbacks.expand} onKeyUp={callbacks.onKeyboardExpand} tabIndex={0}>
        <SelectorItem item={selectedCountry} />
        <img
          className={isExpanded ? `${styles.Chevron} ${styles.Open}` : styles.Chevron}
          src={chevron}
        />
      </div>
      {isExpanded && (
        <div className={styles.Dropdown}>
          <input className={styles.DropdownInput}
                 placeholder="Поиск"
                 autoFocus
                 value={search}
                 onChange={callbacks.onSearchChange}
                 onKeyUp={callbacks.onKeyUp}
          />
          <div className={styles.DropdownList} >
            {countries.map((i, index) => (
              <div key={i._id} onClick={(e) => callbacks.onSelectionChange(i._id)}
                               onMouseEnter={() => setHovered(i._id) }
                               ref={(e) => itemRefs.current[index] = e}
              >
                <SelectorItem item={i} isSelected={props.selected === i._id} isHovered={i._id === hovered}/>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Selector);
