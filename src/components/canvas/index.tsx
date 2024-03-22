import { FC, useEffect, useMemo, useRef } from "react";
import { cn as bem } from "@bem-react/classname";
import Core from "./core";
import { CanvasPropsType } from "./type";
import "./style.css";

export const Canvas: FC<CanvasPropsType> = ({ color, stroke, figure, fill, draw, labelClear, labelSave, labelGenerate }) => {
  const cn = bem("Canvas");

  const rootRef = useRef<HTMLDivElement>(null);
  const core = useMemo(() => new Core(), []);

  useEffect(() => {
    if(rootRef.current) {
      core.mount(rootRef.current);
    }
    return () => core.unmount();
  }, []);

  useEffect(() => {
    core.changeOptions({ color, stroke, figure, fill, draw });
  }, [color, stroke, figure, fill, draw]);

  return (
    <>
      <div className={cn("buttons")}>
        <button className={cn("clear")} onClick={() => core.onClear()}>
          {labelClear}
        </button>
        <button className={cn("save")} onClick={() => core.onSave()}>
          {labelSave}
        </button>
        <button className={cn("generate")} onClick={() => core.generate()}>
          {labelGenerate}
        </button>
      </div>
      <div className={cn()} ref={rootRef} />
    </>
  );
};
