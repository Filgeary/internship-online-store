import { FC } from "react";
import { cn as bem } from "@bem-react/classname";
import Select from "../select";
import { PanelPropsType } from "./type";
import "./style.css";

export const Panel: FC<PanelPropsType> = (props) => {
  const {
    action,
    setAction,
    figures,
    labelFill,
    options,
    labelDraw,
  } = props;
  const cn = bem("Panel");

  return (
    <div className={cn()}>
      <label>
        <input
          type="checkbox"
          className={cn("checkbox")}
          checked={action.draw}
          onChange={() =>
            setAction((prev) => ({ ...prev, draw: !action.draw, name: "" }))
          }
        />
        {labelDraw}
      </label>
      <label>
        <input
          type="checkbox"
          className={cn("checkbox")}
          checked={action.fill}
          onChange={() =>
            setAction((prev) => ({ ...prev, fill: !action.fill }))
          }
        />
        {labelFill}
      </label>
      {figures.map(({ title, icon }) => (
        <button
          aria-label={"draw " + title}
          className={cn("figure", { active: action.figure === title })}
          onClick={() =>
            setAction((prev) => ({ ...prev, figure: title }))
          }
          key={title}
        >
          {icon}
        </button>
      ))}
      <Select
        options={options}
        value={action.stroke}
        onChange={(stroke: number) =>
          setAction((prev) => ({ ...prev, stroke }))
        }
      />
      <input
        type="color"
        aria-label="choose color"
        value={action.color}
        onChange={(e) =>
          setAction((prev) => ({ ...prev, color: e.target.value }))
        }
      />
    </div>
  );
};
