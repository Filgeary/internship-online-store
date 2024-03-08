import DrawCanvas from "@src/components/draw-canvas";
import React from "react";

type Props = {};

const Draw = (props: Props) => {
  const draw = (ctx: CanvasRenderingContext2D | null) => {
    if (ctx) {
      // синий круг
      ctx.beginPath();

      ctx.fillStyle = "blue";
      ctx.arc(100, 100, 50, 0, 2 * Math.PI);
      ctx.fill();
     // ctx.closePath();
      
      // красный прямоугольник
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.fillRect(350, 50, 100, 100);
      
      // зеленый треугольник
      ctx.beginPath();
      ctx.fillStyle = "green";
      ctx.moveTo(250, 50);
      ctx.lineTo(300, 150);
      ctx.lineTo(200, 150);
      ctx.fill();
   
    }
  };
  const heigth = window.innerHeight;
  const width = 1024;
  return (
    <>
      <DrawCanvas draw={draw} height={heigth} width={width} />
    </>
  );
};

export default Draw;
