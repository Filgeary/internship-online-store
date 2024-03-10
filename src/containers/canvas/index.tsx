import { memo, useCallback, useState } from "react";
import CanvasDraw from "@src/components/canvas-draw";
import useTranslate from "@src/hooks/use-translate";

type TDrawFigure = {
  ctx: CanvasRenderingContext2D | null;
  color: string;
  x: number;
  y: number;
};

const Canvas = () => {
  const [isColor, setIsColor] = useState("");
  const [isFigure, setIsFigure] = useState("");

  const figure = [
    { value: null, title: "Выберите фигуру" },
    { value: "Круг", title: "Круг" },
    { value: "Квадрат", title: "Квадрат" },
    { value: "Прямоугольник", title: "Прямоугольник" },
    { value: "Треугольник", title: "Треугольник" },
  ];

  const color = [
    { value: null, title: "Выберите цвет" },
    { value: "#000000", title: "Черный" },
    { value: "#ff0000", title: "Красный" },
    { value: "#0000ff", title: "Синий" },
    { value: "#00ff00", title: "Зеленый" },
  ];

  const callbacks = {
    drawCircle: ({ ...args }: TDrawFigure) => {
      if (args.ctx) {
        args.ctx.beginPath();
        args.ctx.fillStyle = args.color;
        args.ctx.arc(args.x, args.y, 25, 0, 2 * Math.PI);
        args.ctx.fill();
      }
    },

    drawSquare: (args: TDrawFigure) => {
      if (args.ctx) {
        args.ctx.beginPath();
        args.ctx.fillStyle = args.color;
        args.ctx.fillRect(args.x, args.y, 50, 50);
      }
    },

    drawRectangle: (args: TDrawFigure) => {
      if (args.ctx) {
        args.ctx.beginPath();
        args.ctx.fillStyle = args.color;
        args.ctx.fillRect(args.x, args.y, 100, 50);
      }
    },

    drawTriangle: (args: TDrawFigure) => {
      if (args.ctx) {
        args.ctx.beginPath();
        args.ctx.fillStyle = args.color;
        args.ctx.moveTo(args.x, args.y);
        args.ctx.lineTo(args.x + 25, args.y + 50);
        args.ctx.lineTo(args.x - 25, args.y + 50);
        args.ctx.fill();
      }
    },

    draw: useCallback(
      (ctx: CanvasRenderingContext2D | null, x: number, y: number) => {
       
        switch (isFigure) {
          case "Круг":
            if (isColor && x && y) {
              return callbacks.drawCircle({
                ctx: ctx,
                color: isColor,
                x: x,
                y: y,
              });
            }
            return null;
          case "Квадрат":
            if (isColor && x && y) {
              return callbacks.drawSquare({
                ctx: ctx,
                color: isColor,
                x: x,
                y: y,
              });
            }
            return null;
          case "Прямоугольник":
            if (isColor && x && y) {
              return callbacks.drawRectangle({
                ctx: ctx,
                color: isColor,
                x: x,
                y: y,
              });
            }
            return null;
          case "Треугольник":
            if (isColor && x && y) {
              return callbacks.drawTriangle({
                ctx: ctx,
                color: isColor,
                x: x,
                y: y,
              });
            }
            return null;
          default:
            return null;
        } 
      },
      [isFigure,isColor]
    ),
  };

  const { t } = useTranslate(); 

  return (
    <>
      <CanvasDraw
        draw={callbacks.draw}
        figure={figure}
        color={color}
        selectColor={setIsColor}
        selectFigure={setIsFigure}
        isColor={isColor}
        isFigure={isFigure}
        t={t}
      />
    </>
  );
};

export default memo(Canvas);
