import { Figures } from "@src/components/canvas/core/type";

export const PushElement = (shapes: Figures, ) => {
  if (
    shapes.at(-1)?.startX !== action.targetX &&
    shapes.at(-1)?.startY !== action.targetY
  ) {
    shapes.push(rectangle);
  } else {
    shapes.splice(-1, 1, rectangle);
  }
}
