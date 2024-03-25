import { Point } from "..";
import { CanvasAction } from "../../../containers/canvas-layout";
import Figure from "./figure";
import Circle from "./shapes/circle";
import Square from "./shapes/square";
import Triangle from "./shapes/triangle";

export const figureFactory = (coords: Point, action: CanvasAction) => {
  let figure: Figure;
  switch (action.type) {
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
      break;
  }

  return figure;
}
