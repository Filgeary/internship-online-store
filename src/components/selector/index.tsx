import {
  ChangeEvent,
  memo,
  useState,
  KeyboardEvent,
  useRef,
  useEffect,
  MouseEvent,
} from "react";
import { SelectorPropsType } from "./types";
import chevron from "./chevron.svg";
import cross from './cross.svg';
import styles from "./style.module.css";

function Selector(props: SelectorPropsType) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [multiSelection, setMultiSelection] = useState<string[]>([]);

  const selectorRef = useRef(null);
  // Эффект для закрытия при клике вне области выпадающего меню
  useEffect(() => {
    const onClickOutside = (e: PointerEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("click", onClickOutside, true);
    return () => document.removeEventListener("click", onClickOutside, true);
  }, [selectorRef]);

  const itemRefs = useRef([]);
  const countries = [...props.options];

  const callbacks = {
    excludeFromSelection: (e: MouseEvent<HTMLDivElement>, id: string) => {
      e.stopPropagation();
      props.onChange(props.selected.map(i => {
        if(i._id !== id) {
          return i._id;
        }
      } ))
    },
    cancelAllSelections: (e: MouseEvent<HTMLImageElement>) => {
      e.stopPropagation();
      props.onChange(['']);
    },
    onSearchChange: (e: ChangeEvent<HTMLInputElement>) => {
      props.onChangeFilter(e.currentTarget.value);
      setHovered(null);
    },
    expand: () => {
      if (isExpanded && multiSelection.length > 0) {
        props.onChange(multiSelection);
        setMultiSelection([]);
      }
      setIsExpanded(!isExpanded);
      setHovered(null);
      props.onChangeFilter("");
    },
    onSelectionChange: (e: MouseEvent<HTMLDivElement>, id: string) => {
      if (e?.ctrlKey) {
        setMultiSelection([...multiSelection, id]);
      } else {
        props.onChange([id]);
        callbacks.expand();
      }
    },
    onKeyboardExpand: (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") callbacks.expand();
    },
    onKeyUp: (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.stopPropagation();
        if (e.key === "ArrowDown" && hovered === null) {
          setHovered(countries[0]._id);
          return;
        }
        if (e.key === "ArrowUp" && hovered === null) {
          setHovered(countries[props.options.length - 1]._id);
          itemRefs.current[countries.length - 1].scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
          });
          return;
        }

        const currentItem = countries.findIndex((el) => el._id === hovered);
        const nextItem =
          e.key === "ArrowDown"
            ? countries[currentItem + 1]
            : countries[currentItem - 1];
        if (nextItem) {
          setHovered(nextItem._id);
          itemRefs.current[currentItem].scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "start",
          });
          return;
        }
      }
      if (e.key === "Escape") callbacks.expand();
      if (e.key === "Enter" && hovered !== null){
        callbacks.onSelectionChange(null, hovered);
      }

    },
  };

  return (
    <div ref={selectorRef}>
      <div
        className={styles.Selector}
        onClick={callbacks.expand}
        onKeyUp={callbacks.onKeyboardExpand}
        tabIndex={0}
      >
        {props.selected.length === 1 ? (
          props.selectOneRender(props.selected[0])
        ) : (
          <div className={styles.SelectorMulti}>
            {props.selected.map(i => (
              <div key={i._id} onClick={(e) => callbacks.excludeFromSelection(e, i._id)}>
                {props.selectMultiRender(i)}
              </div>
            ))}
          </div>
        )}
        <img src={cross} className={styles.Cross} onClick={callbacks.cancelAllSelections}/>
        <img className={ isExpanded ? `${styles.Chevron} ${styles.Open}` : styles.Chevron }
          src={chevron}/>
      </div>
      {isExpanded && (
        <div className={styles.Dropdown}>
          <input
            className={styles.DropdownInput}
            placeholder="Поиск"
            autoFocus
            value={props.filter}
            onChange={callbacks.onSearchChange}
            onKeyUp={callbacks.onKeyUp}
          />
          <div className={styles.DropdownList}>
            {countries.map((i, index) => (
              <div
                key={i._id}
                onClick={(e) => callbacks.onSelectionChange(e, i._id)}
                onMouseEnter={() => setHovered(i._id)}
                ref={(e) => (itemRefs.current[index] = e)}
              >
                {props.dropdownItem(i,
                  !!multiSelection.find(s => s === i._id) || !!props.selected.find(s => s._id === i._id),
                  i._id === hovered)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(Selector);
