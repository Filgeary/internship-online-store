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
    labelClear,
    labelSave,
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
            setAction((prev) => ({ ...prev, fill: !action.fill, name: "" }))
          }
        />
        {labelFill}
      </label>
      {figures.map(({ title, icon }) => (
        <button
          className={cn("figure", { active: action.figure === title })}
          onClick={() =>
            setAction((prev) => ({ ...prev, figure: title, name: "" }))
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
          setAction((prev) => ({ ...prev, stroke, name: "" }))
        }
      />
      <input
        type="color"
        value={action.color}
        onChange={(e) =>
          setAction((prev) => ({ ...prev, color: e.target.value, name: "" }))
        }
      />
      <button
        className={cn("clear")}
        onClick={() => setAction((prev) => ({ ...prev, name: "clear" }))}
      >
        {labelClear}
      </button>
      <button
        className={cn("save")}
        onClick={() => setAction((prev) => ({ ...prev, name: "save" }))}
      >
        {labelSave}
      </button>
    </div>
  );
};
