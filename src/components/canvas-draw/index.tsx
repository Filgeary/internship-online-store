import { cn as bem } from "@bem-react/classname";
import { memo, useEffect, useRef } from "react";
import Select from "../select";
import "./style.css";
import { TDictionaryKeys } from "@src/i18n/translations";

type TCanvasDrawProps = {
  draw: (...arg: any) => void;
  figure: any[];
  color: any[];
  selectColor: (el: string) => void;
  selectFigure: (el: string) => void;
  isColor: string;
  isFigure: string;
  t: (text: TDictionaryKeys, number?: number) => string;
};

const CanvasDraw = ({
  draw,
  figure,
  color,
  selectColor,
  selectFigure,
  isColor,
  isFigure,
  t,
}: TCanvasDrawProps) => {
  const cn = bem("DrawCanvas");
  const refDiv = useRef<HTMLDivElement | null>(null);
  const refCanvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = refCanvas.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");

      const reDraw = (e: { clientX: number; clientY: number }) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        draw(ctx, x, y);
      };

      canvas.addEventListener("mousedown", reDraw);

      return () => {
        canvas.removeEventListener("mousedown", reDraw);
      };
    }
  }, [isFigure, isColor]);

  const clearCanvas = () => {
    const canvas = refCanvas.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        selectColor("");
        selectFigure("");
      }
    }
  };

  return (
    <div className={cn()} ref={refDiv}>
      <div className={cn("config")}>
        <div className={cn("selections")}>
          <Select options={figure} onChange={selectFigure} value={isFigure} />
          <Select options={color} onChange={selectColor} value={isColor} />
        </div>
        <button onClick={()=>clearCanvas()}>{t("canvas.clear")}</button>
      </div>
      <canvas
        className={cn("canvas")}
        ref={refCanvas}
        height={
          window.innerHeight * 0.7
          /*   window.innerHeight - refCanvas.current.getBoundingClientRect().top */
        }
        width={
          1024
          /* refCanvas.current.getBoundingClientRect().right -
        refCanvas.current.getBoundingClientRect().left */
        }
        style={{ backgroundColor: "#f5f5f5" }}
      ></canvas>
    </div>
  );
};

export default memo(CanvasDraw);
