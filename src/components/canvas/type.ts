export type CanvasPropsType = {
  stroke: number;
  color: string;
  figure: FigureType;
  fill: boolean;
  draw: boolean;
  action: string;
  labelGenerate: string
};

export type FigureType =
  | "rectangle"
  | "circle"
  | "pencil"
  | "triangle"
  | "eraser"
  | "line"
