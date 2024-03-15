import { TShapes } from '../shapes/types';

function doShapeCopy(shape: TShapes) {
  return {
    ...shape,
    options: { ...shape.options, startCoords: { ...shape.options.startCoords } },
    draw: shape.draw,
    mouseIn: shape.mouseIn,
  };
}

export default doShapeCopy;
