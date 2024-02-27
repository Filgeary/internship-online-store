import { memo, useCallback, useRef, useState } from "react";
import { ISelectCustomProps, Option, ShowDirection } from "../types";
import { cn as bem } from "@bem-react/classname";
import "./style.css";
import useClickOutside from "@src/hooks/use-click-outside";

interface ISelectedOptionsListProps<ValueType extends Option> {
  options: ValueType[];
  renderOption: Exclude<
    ISelectCustomProps<ValueType>["renderSelectedOption"],
    undefined
  >;
  onSelect: (option: ValueType) => void;
  maxShowOptions: number;
  direction: ShowDirection;
}

function SelectedOptionsList<ValueType extends Option>(
  props: ISelectedOptionsListProps<ValueType>
) {
  const { maxShowOptions = props.options.length } = props;
  const cn = bem("SelectedOptionsList");
  const [isShowMore, setIsShowMore] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsShowMore(false));

  const callbacks = {
    onBtnClick: useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
      e.stopPropagation();
      setIsShowMore((prev) => !prev);
    }, []),
  };

  const renderSelectedItem = useCallback(
    (option: ValueType) => (
      <span
        key={option.value}
        className={cn("selectedItem")}
        onClick={(e) => {
          e.stopPropagation();
          props.onSelect(option);
        }}
      >
        {props.renderOption(option)}
      </span>
    ),
    [props]
  );

  return (
    <>
      {props.options
        .slice(0, maxShowOptions)
        .map((option) => renderSelectedItem(option))}
      <div className={cn("moreOptions")} ref={menuRef} >
        {props.options.length - maxShowOptions > 0 && (
          <div className={cn("moreBtn")} onClick={callbacks.onBtnClick}>
            +{props.options.length - maxShowOptions}
          </div>
        )}
        {isShowMore && (
          <div className={cn("menu", { direction: props.direction })} onClick={(e) => e.stopPropagation()}>
            {props.options
              .slice(maxShowOptions)
              .map((option) => renderSelectedItem(option))}
          </div>
        )}
      </div>
    </>
  );
}

export default memo(SelectedOptionsList) as <ValueType extends Option>(
  props: ISelectedOptionsListProps<ValueType>
) => JSX.Element;
