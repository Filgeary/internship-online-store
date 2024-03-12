import { useState } from 'react';

import CanvasPanel, { TCanvasActions } from '@src/components/canvas-panel';
import Canvas from '@src/containers/canvas';

const CanvasPage = () => {
  const [action, setAction] = useState<TCanvasActions | ''>('');

  const handleAction = (action: TCanvasActions) => {
    setAction(action);
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <Canvas action={action} />
      <CanvasPanel onAction={handleAction} />
    </div>
  );
};

export default CanvasPage;
