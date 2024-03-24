import Shape from "@src/pages/canvas/components/canvas/core/shapes";

class ShapeGrid {
  private cellSize: number;
  private cells: Map<string, Shape[]>;

  constructor(cellSize: number) {
    this.cellSize = cellSize;
    this.cells = new Map();
  }

  public addToCell(shape: Shape): void {
    const {width, height} = shape.getDimensions();
    const x=  shape.startX + width * window.devicePixelRatio
    const y=  shape.startY + height * window.devicePixelRatio
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    const cellKey = `${cellX},${cellY}`;

    if (!this.cells.has(cellKey)) {
      this.cells.set(cellKey, []);
    }

    this.cells.get(cellKey)!.push(shape);
  }
  //
  public getShapesAtPoint(x: number, y: number): Shape[] {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    const cellKey = `${cellX},${cellY}`;

    return this.cells.get(cellKey) || [];
  }
}

export default ShapeGrid;
