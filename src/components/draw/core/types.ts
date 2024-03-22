import Figure from "../figures";

export type DrawOptions = {
  strokeStyle: string;
  lineWidth: number;
  figure: Figure;
  isFill: boolean;
  fillStyle?: string;
};

export type Action = {
  name: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  element?: Figure;
  snapshot?: ImageData;
};

export type ScrollParams = {
  x?: number;
  y?: number;
  dx?: number;
  dy?: number;
};

export type ZoomParams = {
  center: Point;
  zoom?: number;
  delta?: number;
};

export type Point = {
  x: number;
  y: number;
};
