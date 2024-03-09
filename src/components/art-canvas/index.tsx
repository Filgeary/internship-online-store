import './style.css';

import React, { memo, useContext, useEffect, useState } from 'react';
import { cn as bem } from '@bem-react/classname';

import ArtCanvasTitle from './art-canvas-title';
import ArtCanvasInner from './art-canvas-inner';
import ArtCanvasOptions from './art-canvas-options';

const ArtCanvasContext = React.createContext(null);

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
  const canSave =
    bgColor !== initValues.bgColor ||
    brushWidth !== initValues.brushWidth ||
    brushColor !== initValues.brushColor ||
    images.length !== 0;

  const cn = bem('ArtCanvas');

  useEffect(() => {
    console.log('@', images);
  }, [images]);

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
