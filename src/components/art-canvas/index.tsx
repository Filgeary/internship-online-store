import './style.css';

import React, { memo, useContext, useState } from 'react';
import { cn as bem } from '@bem-react/classname';

import ArtCanvasTitle from './art-canvas-title';
import ArtCanvasInner from './art-canvas-inner';
import ArtCanvasOptions from './art-canvas-options';

import { TArtCanvasContext } from './types';

const ArtCanvasContext = React.createContext<TArtCanvasContext>(null);

export const useArtCanvasContext = () => {
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

  const [bgColor, setBgColor] = useState(initValues.bgColor);
  const [brushWidth, setBrushWidth] = useState(initValues.brushWidth);
  const [brushColor, setBrushColor] = useState(initValues.brushColor);
  const [images, setImages] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const canSave =
    bgColor !== initValues.bgColor ||
    brushWidth !== initValues.brushWidth ||
    brushColor !== initValues.brushColor ||
    images.length !== 1;

  const cn = bem('ArtCanvas');

  return (
    <div className={cn()}>
      <ArtCanvasContext.Provider
        value={{
          bgColor,
          setBgColor,
          brushWidth,
          setBrushWidth,
          brushColor,
          setBrushColor,
          images,
          setImages,
          activeImage,
          setActiveImage,
          canSave,
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
};
