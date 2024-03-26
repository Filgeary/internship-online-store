import { memo, useMemo, useRef, useState } from "react";
import CanvasHead from "../canvas-head";
import { cn as bem } from "@bem-react/classname";
import "./style.css";
import Draw from "./draw";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

const CanvasDraw = () => {
  const cn = bem("DrawCanvas");
  const [count, setCount] = useState(0);

  const refRoot = useRef<HTMLDivElement>(null);
  const draw = useMemo(() => new Draw(count), [count]);

  useIsomorphicLayoutEffect(() => {
    if (refRoot.current) draw.mount(refRoot.current);
    return () => draw.unmount();
  }, [count]);

  return (
    <>
      <CanvasHead setCount={setCount} count={count} />
      <div className={cn()} ref={refRoot} />
    </>
  );
};

export default memo(CanvasDraw);
