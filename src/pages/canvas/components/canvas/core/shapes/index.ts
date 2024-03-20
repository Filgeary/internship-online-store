import {keysShape} from "@src/pages/canvas/components/canvas/core/shapes/types";
import {generateUniqueCode} from "@src/shared/utils/unique-code";

abstract class Shape {
  public startX: number;
  public startY: number;
  public endX: number;
  public endY: number;
  public lineWidth: number;
  public color: string;
  public filling: boolean;
  public fillingColor: Color | null;
  public uniqueID: string;
  public name: keysShape;


  constructor(name: keysShape, startX: number, startY: number, endX: number, endY: number, lineWidth: number, color: string, filling: boolean, fillingColor?: Color) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.lineWidth = lineWidth;
    this.color = color;
    this.filling = filling;
    this.fillingColor = fillingColor || null;
    this.name = name
    this.uniqueID = generateUniqueCode(50, 9)
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;
  abstract movingWhileDrawing(x: number, y: number): void

  public getUniqueID = () => {
    return `${this.name}_${this.color}_${this.uniqueID}-${this.startX}_${this.endX}-${this.startY}_${this.endY}`
  }
  public changingObject = () => {
    this.uniqueID = generateUniqueCode(50, 9)
  }
}

export default Shape;
