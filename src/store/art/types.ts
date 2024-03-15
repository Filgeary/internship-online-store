import { TShapes } from '@src/components/art-canvas/shapes/types';

export type TArtState = {
  bgColor: string;
  brushWidth: number;
  brushColor: string;
  images: TArtImagesState;
  activeTool: TTools;
  fillColor: boolean;
  panOffset: TCoords2D;
  scaleOffset: TCoords2D;
  scale: number;
};

export type TTools = 'brush' | 'square' | 'circle' | 'triangle';
export type TArtImage = HTMLImageElement & { loaded: boolean };
export type TCoords2D = {
  x: number;
  y: number;
};

export type TArtImagesState = {
  imagesNodes: TArtImage[];
  shapes: TShapes[];
  shapesHistory: TShapes[][];
};
