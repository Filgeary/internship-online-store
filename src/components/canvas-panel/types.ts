import { actionsIconsMap, drawModeIconsMap, moveModeIconsMap } from '.';

export type TCanvasModes = TCanvasMoveModes | TCanvasDrawModes;
export type TCanvasActions = keyof typeof actionsIconsMap;
export type TCanvasMoveModes = keyof typeof moveModeIconsMap;
export type TCanvasDrawModes = keyof typeof drawModeIconsMap;
