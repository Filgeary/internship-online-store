import React, {useEffect, useRef} from 'react';
import CanvasManager from "@src/ww-old-canvas-core-postponed/index";
import './style.css';
import Controls from "@src/ww-old-components-postponed/controls";

function CanvasComponent() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  let canvasManager: CanvasManager | null = null;

  useEffect(() => {
    if (canvasRef.current) {
      canvasManager = new CanvasManager(canvasRef.current);
    }
    return () => {
      if (canvasManager) {
        canvasManager.removeEventListeners();
      }
    };
  }, []);


  return (
    <div className={'CanvasContainer'}>
      <canvas ref={canvasRef} width={500} height={500} className={'CanvasComponent'}/>
      <Controls padding={'none'} title={'Очистить холст'} onAdd={() => canvasManager?.clearCanvas()}/>
    </div>
  );
}

export default CanvasComponent;
