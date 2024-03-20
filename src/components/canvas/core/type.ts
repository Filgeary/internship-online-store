import { FiguresNames, ShapeInstance, valueShape } from "./shapes/type";

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
  x: number;
  y: number;
  targetX: number;
  targetY: number;
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
