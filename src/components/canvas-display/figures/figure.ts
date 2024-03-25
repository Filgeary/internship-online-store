abstract class Figure {
  x: number;
  y: number;
  color: string | undefined;
  width: number | undefined;

  falling: boolean = false;
  private isFalling: boolean = false;
  private startTime: Date;
  private mass: number;
  private delta: number = 0;

  constructor(x: number, y: number, color?: string, width?: number) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;

    const max = 100;
    const min = 20;
    this.mass = (Math.random() * (max - min + 1)) + min;
  }

  abstract draw(ctx: CanvasRenderingContext2D): void;

  abstract insideFigure(x: number, y: number): boolean;

  getCoords() {
    if(this.startTime && this.isFalling) {
      const newDate = new Date();
      const t = (newDate.getTime() - this.startTime.getTime()) / 1000;
      this.delta = 0.5 * ( 9.81 * (t ** 2) * this.mass);
    }
    return {
      x: this.x,
      y: this.y + this.delta,
    }
  }

  setNewCoords(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toogleFall() {
    this.falling = !this.falling;
    this.setFalling(this.falling);
  }

  setFalling(value: boolean) {
    this.isFalling = value;
    if(value) {
      this.startTime = new Date();
    } else {
      this.y = this.y + this.delta;
      this.delta = 0;
    }
  }
}

export default Figure;
