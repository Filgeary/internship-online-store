import { memo, useCallback, useEffect, useRef, useState } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";
import SideLayout from "../side-layout";
import Figure from "@src/containers/draw-canvas/figures";

interface ICanvasProps {
  strokeStyle: string;
  lineWidth: number;
  figure: Figure;
  isFill: boolean;
}

function Canvas(props: ICanvasProps) {
  const cn = bem("Canvas");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [historyDraws, setHistory] = useState<ImageData[]>([]);
  const [cancleHistory, setCancleHistory] = useState<ImageData[]>([]);
  const [snapShot, setSnapShot] = useState<ImageData>();
  const [startMouse, setStartMouse] = useState<{ x: number; y: number }>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }
    const dpr = window.devicePixelRatio;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.height * dpr;
    context.scale(dpr, dpr);
    contextRef.current = context;
  }, [canvasRef.current]);

  useEffect(() => {
    const context = contextRef.current;
    if (!context) {
      return;
    }
    context.lineCap = "round";
    context.strokeStyle = props.strokeStyle;
    context.lineWidth = props.lineWidth;
    context.fillStyle = props.strokeStyle;
    contextRef.current = context;
  }, [props, contextRef.current]);

  const callbacks = {
    startDrawing: useCallback(
      ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
        if (!contextRef.current || !canvasRef.current) {
          return;
        }
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        const snapShot = contextRef.current?.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        setHistory([...historyDraws, snapShot]);
        setCancleHistory([]);
        setSnapShot(snapShot);
        setStartMouse({ x: offsetX, y: offsetY });
        setIsDrawing(true);
      },
      [contextRef, canvasRef, historyDraws, setIsDrawing]
    ),
    finishDrawing: useCallback(() => {
      contextRef.current?.closePath();
      setIsDrawing(false);
    }, [contextRef]),
    drawing: useCallback(
      ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !contextRef.current) {
          return;
        }
        const canvasContext = contextRef.current;
        canvasContext.putImageData(snapShot!, 0, 0);
        const { offsetX, offsetY } = nativeEvent;
        props.figure.draw(canvasContext, {
          offsetX,
          offsetY,
          fill: props.isFill,
          startMouseX: startMouse?.x ?? offsetX,
          startMouseY: startMouse?.y ?? offsetY,
        });
      },
      [contextRef, isDrawing, props]
    ),
    clearCanvas: useCallback(() => {
      if (!contextRef.current || !canvasRef.current) {
        return;
      }
      contextRef.current.fillStyle = "white";
      contextRef.current.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      setCancleHistory([]);
    }, [contextRef, canvasRef.current]),
    undoLastDrawing: useCallback(() => {
      if (!contextRef.current || !canvasRef.current) {
        return;
      }
      const ctx = contextRef.current;
      if (historyDraws.length > 0) {
        setCancleHistory([
          ...cancleHistory,
          contextRef.current.getImageData(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          ),
        ]);
        ctx.putImageData(historyDraws[historyDraws.length - 1], 0, 0);
        setHistory(historyDraws.slice(0, -1));
      }
    }, [contextRef, canvasRef, historyDraws, cancleHistory]),
    cancleUndoLastDrawing: useCallback(() => {
      if (!contextRef.current || !canvasRef.current) {
        return;
      }
      const ctx = contextRef.current;
      if (cancleHistory.length > 0) {
        setHistory([
          ...historyDraws,
          contextRef.current.getImageData(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          ),
        ]);
        ctx.putImageData(cancleHistory[cancleHistory.length - 1], 0, 0);
        setCancleHistory(cancleHistory.slice(0, -1));
      }
    }, [contextRef, cancleHistory, historyDraws]),
  };

  return (
    <>
      <div>
        <button onClick={callbacks.clearCanvas}>Очистить</button>
        <button
          onClick={callbacks.undoLastDrawing}
          disabled={historyDraws.length === 0}
        >
          Отменить
        </button>
        <button
          onClick={callbacks.cancleUndoLastDrawing}
          disabled={cancleHistory.length === 0}
        >
          Вернуть
        </button>
      </div>
      <SideLayout side="center">
        <canvas
          className={cn()}
          onMouseDown={callbacks.startDrawing}
          onMouseUp={callbacks.finishDrawing}
          onMouseMove={callbacks.drawing}
          width={800}
          height={500}
          ref={canvasRef}
        />
      </SideLayout>
    </>
  );
}

export default memo(Canvas);
