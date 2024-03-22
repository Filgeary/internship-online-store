import { useState } from 'react';

import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from '@src/canvas/constants';
import CanvasPanel from '@src/components/canvas-panel';
import CanvasZoomPanel from '@src/components/canvas-zoom-panel';
import Canvas from '@src/containers/canvas';

import type { TCanvasActions, TCanvasModes } from '@src/components/canvas-panel/types';

const CanvasPage = () => {
  const [currentZoom, setCurrentZoom] = useState(1);
  const [mode, setMode] = useState<TCanvasModes>('draw');
  const [action, setAction] = useState<TCanvasActions | ''>('');

  const handleChangeMode = (mode: TCanvasModes) => {
    setMode(mode);
  };

  const handleAction = (action: TCanvasActions) => {
    setAction(action);
    setTimeout(() => {
      setAction(''); // Reset action prop for correct useEffect
      if (action === 'reset') {
        setMode('draw');
        setCurrentZoom(1);
      }
    }, 0);
  };

  const handleZoomIn = (zoomDelta?: number) => {
    if (zoomDelta) {
      setCurrentZoom(prev => Math.min(MAX_ZOOM, prev + zoomDelta));
    } else {
      setCurrentZoom(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
    }
  };

  const handleZoomOut = (zoomDelta?: number) => {
    if (zoomDelta) {
      setCurrentZoom(prev => Math.max(MIN_ZOOM, prev - zoomDelta));
    } else {
      setCurrentZoom(prev => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <Canvas
        mode={mode}
        action={action}
        zoom={currentZoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
      <CanvasPanel
        onChangeAction={handleAction}
        onChangeMode={handleChangeMode}
        activeMode={mode}
      />
      <CanvasZoomPanel
        currentZoom={currentZoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        resetScale={() => setCurrentZoom(1)}
      />
    </div>
  );
};

export default CanvasPage;
