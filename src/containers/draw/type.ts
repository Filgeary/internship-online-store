import { FigureType } from "@src/components/canvas/type";

export type Actions = {
  color: string;
  stroke: number;
  figure: FigureType;
  fill: boolean;
  draw: boolean
};
