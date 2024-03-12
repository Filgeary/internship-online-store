import { memo, useEffect, useRef, MouseEvent, useState } from "react";
import s from './style.module.css';
import { CanvasAction } from "../../containers/canvas-layout";
import Square from "./figures/shapes/square";
import Figure from "./figures/figure";
import Circle from "./figures/shapes/circle";
import Triangle from "./figures/shapes/triangle";
import LinePath from "./figures/shapes/linePath";

const CANVAS_WIDTH = 970;
const CANVAS_HEIGHT = 620;

export type Point = {
  x: number;
  y: number;
}
type CanvasDisplayPropsType = {
  canvasAction: CanvasAction;
}

function CanvasDisplay(props: CanvasDisplayPropsType) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [shapes, setShapes] = useState<Figure[]>([]);
  const [draggedItem, setDraggedItem] = useState<{shape: Figure, coordsD: Point } | null>(null);
  const [mouseDraw, setMousePrev] = useState<{path: LinePath,  prev: Point} | null>(null);

  useEffect(() => {
    if(props.canvasAction?.type === "clear") {
      canvasRef.current.getContext("2d").clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      setShapes([]);
    }
  }, [props.canvasAction])

  const callbacks = {
    drawFigure: (e: MouseEvent<HTMLCanvasElement>) => {
      const coords = mouseCoordsInCanvas(e);
      const drag = mouseInShape(coords.x, coords.y, shapes);

      if(props.canvasAction.type === "line" && !drag) {
        setMousePrev({path: new LinePath(coords.x,
                                         coords.y,
                                         props.canvasAction.color,
                                         props.canvasAction.lineWidth),
                                         prev: coords});
      }

      if(!drag && props.canvasAction.type !== "line") {
        if(canvasRef.current && props.canvasAction) {
          const newShape = createShape(coords, props.canvasAction);
          if(newShape) {
            newShape.draw(canvasRef.current.getContext("2d"))
            setShapes([...shapes, newShape]);
          }
        }
      }
      if(drag) {
        setDraggedItem({shape: drag, coordsD: {x: coords.x - drag.x, y: coords.y - drag.y }});
      }
    },
    mouseRelease: () => {
      if(mouseDraw !== null) {
        setShapes([...shapes, mouseDraw.path])
      }
      setMousePrev(null);
      setDraggedItem(null);
    },
    mouseMove: (e: MouseEvent<HTMLCanvasElement>) => {
      let c = mouseCoordsInCanvas(e);
      if(draggedItem) {
        draggedItem.shape.setNewCoords(c.x - draggedItem.coordsD.x, c.y - draggedItem.coordsD.y)
        reDrawShapes(canvasRef.current.getContext("2d"), shapes);
      }
      if(props.canvasAction.type === "line" && mouseDraw !== null) {
        mouseDraw.path.drawing(canvasRef.current.getContext("2d"), c.x, c.y)
      }
    }
  }

  return (
    <div className={s.Wrapper}>
      <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef}
              onMouseUp={callbacks.mouseRelease}
              onMouseDown={callbacks.drawFigure}
              onMouseMove={callbacks.mouseMove}
      />
    </div>
  )
}

export default memo(CanvasDisplay);

function mouseCoordsInCanvas(e: MouseEvent<HTMLCanvasElement>): Point {
  return {
    //@ts-ignore
    x: e.clientX - e.target.getBoundingClientRect().left,
    //@ts-ignore
    y: e.clientY - e.target.getBoundingClientRect().top,
  }
}

function createShape(coords: Point, action: CanvasAction) {
  let figure: Figure;
  switch(action.type) {
    case "square":
      figure = new Square(coords.x, coords.y, action.color, action.lineWidth);
      break;
    case "circle":
      figure = new Circle(coords.x, coords.y, action.color, action.lineWidth);
      break;
    case "triangle":
      figure = new Triangle(coords.x, coords.y, action.color, action.lineWidth);
      break;
    case "clear":
      break;
    default:
      throw new Error("No such shape of Figure");
  }

  return figure;
}

function mouseInShape(x: number, y: number, shapes: Figure[]) {
  let figureToDrag: Figure;
  for( const shape of shapes) {
    if(shape.insideFigure(x, y)) {
      figureToDrag = shape;
    }
  }
  return figureToDrag
}

function reDrawShapes(ctx: CanvasRenderingContext2D, shapes: Figure[]) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  for(const shape of shapes) {
    shape.draw(ctx);
  }
}
