import './style.css';

import React, { memo, useContext } from 'react';
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

function ArtCanvas(props: ArtCanvasProps) {
  const { children } = props;

  const cn = bem('ArtCanvas');

  return (
    <div className={cn()}>
      <ArtCanvasContext.Provider value={{}}>{children}</ArtCanvasContext.Provider>
    </div>
  );
}

export default {
  Root: memo(ArtCanvas),
  Title: memo(ArtCanvasTitle),
  Inner: memo(ArtCanvasInner),
  Options: memo(ArtCanvasOptions),
};
