import * as shapes from './export';

export type typeShapes = typeof shapes
export type keysShape = keyof typeShapes;
export type valueShape = typeShapes[keysShape]
export type initialShape = InstanceType<valueShape>
export type TShapesOptions = {
  value: keysShape,
  title: string
}
export const figures = {Circle: shapes.Circle, Rectangle: shapes.Rectangle, Triangle: shapes.Triangle}
export type TFiguresKeys = keyof typeof figures
