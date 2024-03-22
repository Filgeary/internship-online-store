export type CanvasPropsType = {
  stroke: number;
  color: string;
  figure: FigureType;
  fill: boolean;
  draw: boolean;
  labelGenerate: string;
  labelClear: string;
  labelSave: string;
};

export type FigureType =
  | "rectangle"
  | "circle"
  | "pencil"
  | "triangle"
  | "eraser"
  | "line"
