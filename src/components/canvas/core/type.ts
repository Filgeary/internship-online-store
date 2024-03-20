import { FiguresNames, ShapeInstance } from "./shapes/type";

export type Options = {
  color: string;
  stroke: number;
  figure: FiguresNames;
  fill: boolean;
  draw: boolean;
};

export type Point = {
  x: number;
  y: number;
}

export type Action = {
  name: string;
  targetX: number;
  targetY: number;
  x?: number;
  y?: number;
  element?: ShapeInstance;
};

export type ScrollParams = Partial<{
  x: number;
  y: number;
  dx: number;
  dy: number;
}>;

export type ZoomParams = {
  center: Point;
  zoom?: number;
  delta?: number;
};
