class Figure {
  name: string = "Figure";

  draw(
    canvasContext: CanvasRenderingContext2D,
    options: {
      fill: boolean;
      offsetX: number;
      offsetY: number;
      startMouseX: number;
      startMouseY: number;
    }
  ) {}
}

export default Figure;
