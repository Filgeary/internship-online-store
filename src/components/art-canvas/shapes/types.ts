import Brush from './brush';
import Circle from './cirlce';
import Square from './square';
import Triangle from './triangle';

export type TShapeOptions = {
  bgColor?: string;
  brushWidth: number;
  brushColor: string;
  x?: number;
  y?: number;
  isFilled: boolean;
  startCoords?: TCoords;
  justGetInstance?: boolean;
  initialCoords?: {
    x: number;
    y: number;
    startCoords: {
      x: number;
      y: number;
    };
  };
  panOffset: TCoords;
  fillColor?: string;
};

export type TCoords = {
  x: number;
  y: number;
};

export type TShapes = Brush | Circle | Square | Triangle;
