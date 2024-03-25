import { memo, useEffect, useRef, useMemo } from "react";
import s from "./style.module.css";
import { CanvasAction } from "../../containers/canvas-layout";
import CanvasDraw from "./CanvasDraw";

export type Point = {
  x: number;
  y: number;
};
type CanvasDisplayPropsType = {
  canvasAction: CanvasAction;
};

function CanvasDisplay(props: CanvasDisplayPropsType) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvas = useMemo(() => new CanvasDraw(), []);

  useEffect(() => {
    if (rootRef.current) {
      canvas.mount(rootRef.current);
    }
    return () => canvas.unmount();
  }, []);

  useEffect(() => {
    if (canvas) {
      canvas.setCurrentAction(props.canvasAction);
    }
  }, [props.canvasAction]);

  return (
    <div className={s.Wrapper} ref={rootRef} />
  );
}

export default memo(CanvasDisplay);
