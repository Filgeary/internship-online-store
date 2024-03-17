import { TArtImage, TArtImagesState, TCoords2D, TTools } from '@src/store/art/types';
import { TShapes } from './shapes/types';
import React from 'react';

type TCoords = {
  x: number;
  y: number;
};

export type TArtCanvasContext = {
  values: {
    images: TArtImagesState | null;
    activeImage: number;
    bgColor: string;
    brushWidth: number;
    brushColor: string;
    canSave: boolean;
    activeTool: TTools;
    fillColor: boolean;
    eraserActive: boolean;
    scaleOffset: TCoords2D;
    panOffset: TCoords2D;
    scale: number;
  };

  callbacks: {
    setImages: (imagesVal: TArtImagesState | null) => void;
    setImagesNodes: (imagesNodesVal: TArtImage[]) => void;
    setShapes: (shapesNodesVal: TShapes[]) => void;
    setShapesHistory: (shapesHistoryVal: TShapes[][]) => void;
    setActiveImage: (activeImageVal: number) => void;
    setBgColor: (bgColorVal: string) => void;
    setBrushWidth: (brushWidthVal: number) => void;
    setBrushColor: (brushColorVal: string) => void;
    setActiveTool: (activeToolVal: TTools) => void;
    setFillColor: (fillColorVal: boolean) => void;
    setEraserActive: (eraserActiveVal: boolean) => void;
    setPanOffset: (panOffsetVal: TCoords) => void;
    setScaleOffset: (scaleOffset: TCoords) => void;
    setScale: (scale: number) => void;
    resetAllToDefault: () => void;
  };
};
