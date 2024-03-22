import { useMemo, useState } from "react";
import { Panel } from "@src/components/panel";
import { Canvas } from "@src/components/canvas";
import {
  Circle,
  Eraser,
  Line,
  Pencil,
  Rectangle,
  Triangle,
} from "@src/components/icons/figure";
import { FiguresType } from "@src/components/panel/type";
import useTranslate from "@src/hooks/use-translate";
import { Actions } from "./type";

export const Draw = () => {
  const [action, setAction] = useState<Actions>({
    color: "#000000",
    stroke: 2,
    figure: 'pencil',
    fill: false,
    draw: true,
  });
  const { t } = useTranslate();

  const options = {
    stroke: useMemo(
      () => [
        { value: 1, title: "1px" },
        { value: 2, title: "2px" },
        { value: 5, title: "5px" },
        { value: 10, title: "10px" },
        { value: 20, title: "20px" },
        { value: 30, title: "30px" },
      ],
      []
    ),
    figures: useMemo(
      () => [
        { title: "line", icon: <Line /> },
        { title: "rectangle", icon: <Rectangle /> },
        { title: "circle", icon: <Circle /> },
        { title: "triangle", icon: <Triangle /> },
        { title: "pencil", icon: <Pencil /> },
        { title: "eraser", icon: <Eraser /> },
      ],
      []
    ) as FiguresType[],
  };

  return (
    <>
      <Panel
        action={action}
        setAction={setAction}
        figures={options.figures}
        options={options.stroke}
        labelFill={t("draw.fill")}
        labelDraw={t("draw.draw")}
      />
      <Canvas
        stroke={action.stroke}
        color={action.color}
        figure={action.figure}
        fill={action.fill}
        draw={action.draw}
        labelGenerate={t("draw.generate")}
        labelClear={t("draw.clear")}
        labelSave={t("draw.save")}
      />
    </>
  );
};
