import { FC, useEffect, useMemo, useRef, useState } from "react";
import { cn as bem } from "@bem-react/classname";
import { CanvasPropsType } from "./type";
import "./style.css";
import Core from "./core";

export const Canvas: FC<CanvasPropsType> = ({ color, stroke, figure, fill, action, draw, labelGenerate }) => {
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

    if(action === 'clear') {
      core.onClear();
    } else if(action === 'save') {
      core.onSave();
    }
  }, [color, stroke, figure, fill, action, draw]);

  return (
    <>
      <button
        className={cn("generate")}
        onClick={() => core.generate()}
      >
        {labelGenerate}
      </button>
      <div className={cn()} ref={rootRef} />
    </>
  );
};
