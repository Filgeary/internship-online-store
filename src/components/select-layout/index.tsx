import { memo, FC } from "react";
import { cn as bem } from "@bem-react/classname";
import Img from "../../assets/images/chevron_down.png";
import "./style.css";

interface IСountry {
  title: string;
  _id: string;
}

interface ISelectLayout {
  options: IСountry[];
  value: string;
  onChange: (value: string | number) => void;
  statusOpen: boolean;
}

const SelectLayout: FC<ISelectLayout> = ({
  options,
  value,
  onChange,
  statusOpen,
}) => {
  const cn = bem("Select-layout");

  return (
    <div className={cn()}>
      {statusOpen ? (
        <div className={cn("wrap-list")}>
          <ul className={cn("list")}>
            {options.map((item) => (
              <li className={cn("item")} key={item._id} value={item.title}>
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={cn("input")}>
          <span>{value}</span>
          <img className={cn("img")} src={Img} />
        </div>
      )}
    </div>
  );
};

export default memo(SelectLayout);
