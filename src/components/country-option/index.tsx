import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";

export interface ICountryOption {
  title?: string;
  code: string;
  isSelected?: boolean;
  isHovered?: boolean;
}

export function CountryOption(props: ICountryOption) {
  const cn = bem("CountryOption");
  return (
    <div className={cn({selected: props.isSelected, hovered: props.isHovered})}>
        <div className={cn("icon")}>
            {props.code}
        </div>
        {props.title}
    </div>
    );
}

export default memo(CountryOption);
