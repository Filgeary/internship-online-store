class CanvasManager {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private isDrawing: boolean;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.isDrawing = false;

    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', this.finishDrawing.bind(this));
    this.canvas.addEventListener('mouseout', this.finishDrawing.bind(this));
  }

  private startDrawing = (e: MouseEvent) => {
    const { offsetX, offsetY } = e;
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.moveTo(offsetX, offsetY);
      this.isDrawing = true;
    }
  };

  private draw = (e: MouseEvent) => {
    if (!this.isDrawing || !this.ctx) return;
    const { offsetX, offsetY } = e;
    this.ctx.lineTo(offsetX, offsetY);
    this.ctx.stroke();
  };

  private finishDrawing = () => {
    if (this.ctx) {
      this.ctx.closePath();
      this.isDrawing = false;
    }
  };

  public clearCanvas() {
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  public removeEventListeners() {
    this.canvas.removeEventListener('mousedown', this.startDrawing);
    this.canvas.removeEventListener('mousemove', this.draw);
    this.canvas.removeEventListener('mouseup', this.finishDrawing);
    this.canvas.removeEventListener('mouseout', this.finishDrawing);
  }
}

export default CanvasManager;
