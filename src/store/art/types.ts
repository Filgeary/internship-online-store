export type TArtState = {
  bgColor: string;
  brushWidth: number;
  brushColor: string;
  images: TArtImage[];
  activeTool: TTools;
  fillColor: boolean;
};

export type TTools = 'brush' | 'square' | 'circle' | 'triangle';
export type TArtImage = HTMLImageElement & { loaded: boolean };
