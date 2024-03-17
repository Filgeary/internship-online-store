import { FiguresNames, Shapes } from "./shapes/type";

export type Options = {
  color: string;
  stroke: number;
  figure: FiguresNames;
  fill: boolean;
  draw: boolean;
};

export type Points = {
  x: number;
  y: number;
}

export type Action = {
  name: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  element?: Figures;
};

export type Figures = Shapes["rectangle"] | Shapes["circle"] | Shapes["triangle"] | Shapes['line'];

export type ScrollParams = Partial<{
  x: number;
  y: number;
  dx: number;
  dy: number;
}>;
