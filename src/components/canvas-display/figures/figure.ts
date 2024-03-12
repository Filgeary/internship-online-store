abstract class Figure {
  x: number;
  y: number;
  color: string | undefined;
  width: number | undefined;

  constructor(x: number, y: number, color?: string, width?: number) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;

  abstract insideFigure(x: number, y: number): boolean;

  setNewCoords(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export default Figure;
