import * as figures from './exports';

export type FiguresType = typeof figures;
export type FiguresNames = keyof FiguresType;
export type ShapeInstance = InstanceType<FiguresType[FiguresNames]>;

export type Size = {
  width: number;
  height: number
}

export type Coords = {
  x: number;
  y: number;
}
