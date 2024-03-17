import * as figures from './exports';

export type FiguresType = typeof figures;
export type FiguresNames = keyof FiguresType;

export type Shapes = {
  [key in FiguresNames]: InstanceType<FiguresType[key]>
}

export type Size = {
  width: number;
  height: number
}
