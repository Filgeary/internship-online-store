import { TShapes } from '../shapes/types';
import cloneDeep from 'lodash.clonedeep';

function doShapeCopy(shape: TShapes) {
  return cloneDeep(shape);
}

export default doShapeCopy;
