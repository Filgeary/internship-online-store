import { useState } from 'react';

import CanvasPanel from '@src/components/canvas-panel';
import CanvasZoomPanel from '@src/components/canvas-zoom-panel';
import Canvas from '@src/containers/canvas';

import type { TCanvasActions, TCanvasModes } from '@src/components/canvas-panel/types';

const CanvasPage = () => {
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
      }
    }, 0);
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <Canvas
        mode={mode}
        action={action}
      />
      <CanvasPanel
        onChangeAction={handleAction}
        onChangeMode={handleChangeMode}
        activeMode={mode}
      />
      <CanvasZoomPanel
        currentScale={1}
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        resetScale={() => {}}
      />
    </div>
  );
};

export default CanvasPage;
