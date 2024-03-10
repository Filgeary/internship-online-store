import { TArtImage, TTools } from '@src/store/art/types';

export type TArtCanvasContext = {
  values: {
    images: TArtImage[];
    activeImage: number;
    bgColor: string;
    brushWidth: number;
    brushColor: string;
    canSave: boolean;
    activeTool: TTools;
    fillColor: boolean;
    eraserActive: boolean;
  };

  callbacks: {
    setImages: (imagesVal: TArtImage[]) => void;
    setActiveImage: (activeImageVal: number) => void;
    setBgColor: (bgColorVal: string) => void;
    setBrushWidth: (brushWidthVal: number) => void;
    setBrushColor: (brushColorVal: string) => void;
    setActiveTool: (activeToolVal: TTools) => void;
    setFillColor: (fillColorVal: boolean) => void;
    setEraserActive: (eraserActiveVal: boolean) => void;
  };
};
