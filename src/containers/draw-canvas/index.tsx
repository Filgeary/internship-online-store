import CanvasTools from "@src/components/canvas-tools";
import line from "./figures/line/line.svg";
import eraser from "./figures/eraser/eraser.svg";
import pencil from "./figures/pencil/pencil.svg";
import rectangle from "./figures/rectangle/rectangle.svg";
import triangle from "./figures/triangle/triangle.svg";
import circle from "./figures/circle/circle.svg";
import { memo, useMemo, useState } from "react";
// import {
//   Line,
//   Eraser,
//   Pencil,
//   Triangle,
//   Rectangle,
//   Circle,
// } from "./figures/export-figures";
// import Figure from "./figures";
import SideLayout from "@src/components/side-layout";
import Draw from "@src/components/draw";

import Figure from "@src/components/draw/figures";
import {
  Line,
  Eraser,
  Pencil,
  Triangle,
  Rectangle,
  Circle,
} from "@src/components/draw/figures/export-figures";

function DrawCanvas() {
  const [strokeStyle, setStrokeStyle] = useState<string>("#000000");
  const [lineWidth, setLineWidth] = useState<number>(5);
  const [figure, setFigure] = useState<Figure>(new Pencil());
  const [isFill, setIsFill] = useState(false);

  const options = {
    lineWidth: useMemo(
      () => [
        { value: 2, title: "2px" },
        { value: 5, title: "5px" },
        { value: 10, title: "10px" },
        { value: 16, title: "16px" },
      ],
      []
    ),
    figures: useMemo<{ render: React.ReactNode; value: Figure }[]>(
      () => [
        { value: new Line(), render: <img src={line} /> },
        { value: new Eraser(), render: <img src={eraser} /> },
        { value: new Pencil(), render: <img src={pencil} /> },
        { value: new Rectangle(), render: <img src={rectangle} /> },
        { value: new Triangle(), render: <img src={triangle} /> },
        { value: new Circle(), render: <img src={circle} /> },
      ],
      []
    ),
  };

  return (
    <>
      <SideLayout side="center">
        <CanvasTools
          figures={options.figures}
          figureName={figure.name}
          lines={options.lineWidth}
          changeLineWidth={setLineWidth}
          changeColor={setStrokeStyle}
          changeFigure={setFigure}
          setIsFill={setIsFill}
          color={strokeStyle}
          lineWidth={lineWidth}
        />
      </SideLayout>
      <Draw strokeStyle={strokeStyle} lineWidth={lineWidth} figure={figure} isFill={isFill}/>
      {/* <Canvas strokeStyle={strokeStyle} lineWidth={lineWidth} figure={figure} isFill={isFill}/> */}
    </>
  );
}

export default memo(DrawCanvas);
