import { TTools } from '@src/store/art/types';

export type TDrawShapesMethods = `draw${Capitalize<TTools>}`;
export type TDrawingOptions = {
  isPanning: boolean;
  isCtrlPressed: boolean;
  startX: number;
  startY: number;
  x: number;
  y: number;
  xWithOffset: number;
  yWithOffset: number;
  startPanX: number;
  startPanY: number;
};
