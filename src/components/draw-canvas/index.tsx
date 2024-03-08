import { cn as bem } from "@bem-react/classname";
import { useRef } from "react";
import useInit from "@src/hooks/use-init";
import "./style.css";

type Props = {
  draw: (...args: any) => void;
  height: number;
  width: number;
};

const DrawCanvas = ({ draw, height, width }: Props) => {
  const cn = bem("DrawCanvas");
  const refCanvas = useRef<HTMLCanvasElement | null>(null);

  useInit(() => {
    const canvas = refCanvas.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        draw(ctx);
      }
    }
  }, []);

  return (
    <canvas
      className={cn()}
      ref={refCanvas}
      height={height}
      width={width}
    ></canvas>
  );
};

export default DrawCanvas;
