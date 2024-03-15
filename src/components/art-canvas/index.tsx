import './style.css';

import React, { memo, useContext, useState } from 'react';
import { cn as bem } from '@bem-react/classname';

import ArtCanvasTitle from './art-canvas-title';
import ArtCanvasInner from './art-canvas-inner';
import ArtCanvasOptions from './art-canvas-options';
import ArtCanvasAdditional from './art-canvas-additional';

import { useAppSelector } from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';

import { TArtCanvasContext } from './types';
import { TTools, TArtImagesState, TArtImage, TCoords2D } from '@src/store/art/types';
import { TShapes } from './shapes/types';

const ArtCanvasContext = React.createContext<TArtCanvasContext>(null);

export const useArtCanvasContext = (): TArtCanvasContext => {
  const ctx = useContext(ArtCanvasContext);

  if (!ctx) {
    throw new Error('Компоненты рисовалки должны быть обёрнуты в <ArtCanvas.Root />');
  }

  return ctx;
};

type ArtCanvasProps = {
  children: React.ReactNode;
};

const initValues = {
  bgColor: '#ffffff',
  brushWidth: 5,
  brushColor: '#000000',
};

function ArtCanvas(props: ArtCanvasProps) {
  const { children } = props;

  const store = useStore();
  const select = useAppSelector((state) => ({
    bgColor: state.art.bgColor,
    brushWidth: state.art.brushWidth,
    brushColor: state.art.brushColor,
    images: state.art.images,
    activeTool: state.art.activeTool,
    fillColor: state.art.fillColor,
    panOffset: state.art.panOffset,
    scaleOffset: state.art.scaleOffset,
    scale: state.art.scale,
  }));

  const [activeImage, setActiveImage] = useState(Math.max(0, select.images.imagesNodes.length - 1));
  const [eraserActive, setEraserActive] = useState(false);
  const [zooming, setZooming] = useState({ x: 1, y: 1 });

  const canSave =
    select.bgColor !== initValues.bgColor ||
    select.brushColor !== initValues.brushColor ||
    (select.images.imagesNodes.length !== 1 && activeImage !== 0);

  const values = {
    ...select,
    activeImage,
    canSave,
    eraserActive,
    zooming,
  };

  const callbacks = {
    setActiveImage,
    setImages: (val: TArtImagesState | null) => store.actions.art.setImages(val),
    setImagesNodes: (val: TArtImage[]) => store.actions.art.setImagesNodes(val),
    setShapes: (val: TShapes[]) => store.actions.art.setShapes(val),
    setShapesHistory: (val: TShapes[][]) => store.actions.art.setShapesHistory(val),
    setBgColor: (val: string) => store.actions.art.setBgColor(val),
    setBrushWidth: (val: number) => store.actions.art.setBrushWidth(val),
    setBrushColor: (val: string) => store.actions.art.setBrushColor(val),
    setActiveTool: (val: TTools) => store.actions.art.setActiveTool(val),
    setFillColor: (val: boolean) => store.actions.art.setFillColor(val),
    setPanOffset: (val: TCoords2D) => store.actions.art.setPanOffset(val),
    setScale: (val: number) => store.actions.art.setScale(val),
    setScaleOffset: (val: TCoords2D) => store.actions.art.setScaleOffset(val),
    setEraserActive,
    setZooming,
    resetAllToDefault: () => {
      callbacks.setBgColor('#ffffff');
      callbacks.setBrushColor('#000000');
      callbacks.setBrushWidth(5);
      callbacks.setFillColor(false);
      callbacks.setEraserActive(false);
    },
  };

  const cn = bem('ArtCanvas');

  return (
    <div className={cn()}>
      <ArtCanvasContext.Provider
        value={{
          values,
          callbacks,
        }}
      >
        {children}
      </ArtCanvasContext.Provider>
    </div>
  );
}

export default {
  Root: memo(ArtCanvas),
  Title: memo(ArtCanvasTitle),
  Inner: memo(ArtCanvasInner),
  Options: memo(ArtCanvasOptions),
  Additional: memo(ArtCanvasAdditional),
};
