import { TShapes } from '../shapes/types';
import cloneDeep from 'lodash.clonedeep';

function doShapeCopy(shape: TShapes) {
  return cloneDeep(shape);
  // return {
  //   ...shape,
  //   options: { ...shape.options, startCoords: { ...shape.options.startCoords } },
  //   draw: shape.draw,
  //   mouseIn: shape.mouseIn,
  // };
}

export default doShapeCopy;
