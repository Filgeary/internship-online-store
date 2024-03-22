import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import Core from "./core";
import Figure from "./figures";

interface IDrawProps {
  strokeStyle: string;
  lineWidth: number;
  figure: Figure;
  isFill: boolean;
}

function Draw(props: IDrawProps) {
  const dom = useRef<HTMLDivElement>(null);
  const core = useMemo(() => new Core(), []);

  useEffect(() => {
    if (dom.current) core.mount(dom.current);
    return () => core.unmount();
  }, []);

  useEffect(() => {
    core.changeOptions({
      figure: props.figure,
      isFill: props.isFill,
      lineWidth: props.lineWidth,
      strokeStyle: props.strokeStyle,
    });
  }, [props, core]);

  return (
    <>
      <button onClick={() => core.drawRectangles(1000)}>Нажимай</button>
      <button onClick={() => core.findFirstElement()}>Поиск</button>
      <div className="Draw" ref={dom}></div>
    </>
  );
}

export default memo(Draw);
