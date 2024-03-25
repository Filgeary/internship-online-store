import { CanvasAction } from "../../containers/canvas-layout";
import Figure from "./figures/figure";
import { figureFactory } from "./figures/figureFactory";
import LinePath from "./figures/shapes/linePath";

class CanvasDraw {
  private root: HTMLElement | null;
  private canvas: HTMLCanvasElement | null;
  private ctx: CanvasRenderingContext2D | null;
  private elements: Figure[];
  private dragElement: Figure;
  private resizeObserver: ResizeObserver;

  private action: CanvasAction | null;
  private position = {
    holding: false,
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
  }

  private settings = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    zoom: 1,
    translateX: 0,
    translateY: 0,
  };

  constructor() {
    this.elements = [];
    this.action = null;
    this.dragElement = undefined;
  }

  mount(root: HTMLElement) {
    this.root = root;
    this.canvas = document.createElement("canvas");
    this.root.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    // следим за размерами корневого элемента
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(this.root);

    this.canvas.addEventListener("mousedown", this.mouseDownAction);
    this.canvas.addEventListener('mousemove', this.mouseMove);
    window.addEventListener("mouseup", this.mouseUp);
    this.canvas.addEventListener("wheel", this.mouseWheel);

    if (this.ctx) {
      this.resize();
      this.drawCanvas();
    }
  }

  unmount() {
    if (this.canvas) {
      this.canvas.removeEventListener("mousedown", this.mouseDownAction);
      this.canvas.removeEventListener("mousemove", this.mouseMove);
      window.removeEventListener("mouseup", this.mouseUp);
      this.canvas.removeEventListener("wheel", this.mouseWheel);

      if (this.root) {
        this.root.removeChild(this.canvas);
      }
      this.ctx = null;
      this.canvas = null;
      this.resizeObserver = null;
      this.root = null;
    }
  }

  clearCanvas() {
    this.elements = [];
  }

  private drawCanvas = () => {
    if (this.ctx) {
      this.ctx.save();
      this.ctx.fillStyle = "#00ffff"
      this.ctx.fillRect(0, 0, this.settings.width, this.settings.height);
      this.ctx.translate(-this.settings.translateX, -this.settings.translateY);
      this.ctx.scale(this.settings.zoom, this.settings.zoom);
      for (const shape of this.elements) {
        shape.draw(this.ctx);
      }

      this.ctx.restore();
      window.requestAnimationFrame(this.drawCanvas);
    }
  }

  private resize = () => {
    const rootRect = this.root.getBoundingClientRect();
    const rootStyles = window.getComputedStyle(this.root);

    const topPadding = parseInt(rootStyles.getPropertyValue("padding-top"), 10);
    const topBorder = parseInt(rootStyles.getPropertyValue("border-top-width"), 10);

    const leftPadding = parseInt(rootStyles.getPropertyValue("padding-left"), 10);
    const leftBorder = parseInt(rootStyles.getPropertyValue("border-left-width"), 10);

    const rightPadding = parseInt(rootStyles.getPropertyValue("padding-right"), 10);
    const rightBorder = parseInt(rootStyles.getPropertyValue("border-right-width"), 10);

    const bottomPadding = parseInt(rootStyles.getPropertyValue("padding-bottom"), 10);
    const bottomBorder = parseInt(rootStyles.getPropertyValue("border-bottom-width"), 10);

    this.settings.top = rootRect.top + topPadding + topBorder;
    this.settings.left = rootRect.left + leftPadding + leftBorder;
    this.settings.width = rootRect.width - rightPadding - leftPadding - rightBorder - leftBorder;
    this.settings.height = rootRect.height - bottomPadding - bottomBorder - topPadding - topBorder;

    this.canvas.width = this.settings.width;
    this.canvas.height = this.settings.height;

    this.canvas.style.width = `${this.settings.width}px`;
    this.canvas.style.height = `${this.settings.height}px`;
  }

  setCurrentAction(a: CanvasAction) {
    this.action = a;
    if(a.type === "clear") {
      this.clearCanvas();
    }
    if(a.type === "fall") {
      this.toogleFalling()
    }
    if(a.type === "show") {
      this.showTime();
    }
  }

  private mouseDownAction = (e: MouseEvent) => {
    this.position.holding = true;
    this.mouseCanvasPosition(e.clientX, e.clientY);

    this.position.startX =  e.clientX - this.settings.left;
    this.position.startY = e.clientY - this.settings.top;
    this.dragElement = this.mouseClickedOnFigure(this.position.x, this.position.y);
    if(this.dragElement) {
      this.position.startX = this.position.x - this.dragElement.getCoords().x;
      this.position.startY = this.position.y - this.dragElement.getCoords().y;
      this.dragElement.setFalling(false);
    }

    if (this.action.type !== "line" && !this.dragElement && !e.ctrlKey) {
      const newShape = figureFactory({ x: this.position.x, y: this.position.y }, this.action);
      if (newShape) {
        newShape.draw(this.ctx);
        this.elements.push(newShape);
      }
    }

    if (this.action.type === "line" && !this.dragElement && !e.ctrlKey) {
      this.elements.push(new LinePath(this.position.x,
                                      this.position.y,
                                      this.action.color,
                                      this.action.lineWidth));
      (this.elements[this.elements.length - 1] as LinePath)
          .drawing(this.ctx, this.position.x, this.position.y);
    }
  }

  private mouseMove = (e: MouseEvent) => {
    this.mouseCanvasPosition(e.clientX, e.clientY);
    if(this.dragElement) {
      this.dragElement.setNewCoords(this.position.x - this.position.startX, this.position.y - this.position.startY);
    }

    if(e.ctrlKey && this.position.holding) {
      this.moving(e.clientX, e.clientY)
    }

    if(this.action.type === "line" && !e.ctrlKey && this.position.holding && !this.dragElement) {
      (this.elements[this.elements.length - 1] as LinePath).drawing(this.ctx,
          this.position.x,
          this.position.y);
    }
  }

  private mouseUp = (e: MouseEvent) => {
    this.position.holding = false;
    if(this.dragElement) {
      if(this.dragElement.falling) {
        this.dragElement.setFalling(true);
      }
      this.dragElement = undefined;
    }
  }

  private mouseWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.1 : -0.1;
    this.zooming(e.offsetX, e.offsetY, delta);
  }

  private mouseClickedOnFigure(x: number, y: number) {
    let figureToDrag: Figure;
    for (const shape of this.elements) {
      if (shape.insideFigure(x, y)) {
        figureToDrag = shape;
      }
    }
    return figureToDrag;
  }

  // позиция мышки с учетом масштаба и смещения сцены clientX, clientY
  private mouseCanvasPosition(x: number, y: number) {
    this.position.x = (x - this.settings.left + this.settings.translateX) / this.settings.zoom;
    this.position.y = (y - this.settings.top + this.settings.translateY) / this.settings.zoom;
  }

  private moving(x: number, y: number) {
    this.settings.translateX -= (x - this.settings.left) - this.position.startX;
    this.settings.translateY -= (y - this.settings.top) - this.position.startY;

    this.position.startX = x - this.settings.left;
    this.position.startY = y - this.settings.top;
  }

  private zooming(x: number, y: number, delta: number) {
    const currentCenter = {
      x: (x + this.settings.translateX) / this.settings.zoom,
      y: (y + this.settings.translateY) / this.settings.zoom,
    }

    this.settings.zoom += delta;
    this.settings.zoom = Math.min(3.0, Math.max(0.1, this.settings.zoom));

    const centerNew = {
      x: currentCenter.x * this.settings.zoom,
      y: currentCenter.y * this.settings.zoom,
    }

    this.settings.translateX = centerNew.x - x;
    this.settings.translateY = centerNew.y - y;
  }

  private toogleFalling() {
    for(const shape of this.elements) {
      shape.toogleFall();
    }
  }

  private showTime() {
    for (let i = 0; i < 10000; i++) {
      const params = this.generateRandomFigureParams();
      const newShape = figureFactory({x: params.x, y: params.y}, {type: params.type, color: params.color })

      this.elements.push(newShape);
    }
  }

  private generateRandomFigureParams() {
    const r = Math.floor( Math.random() * 255 + 1);
    const g = Math.floor( Math.random() * 255 + 1);
    const b = Math.floor( Math.random() * 255 + 1);

    const color = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

    const typeNumber = Math.floor(Math.random() * 3 + 1);
    let type: "clear" | "triangle" | "square" | "circle" | "line" | "fall" = "square";
    switch(typeNumber) {
      case 1:
        type = "square";
        break;
      case 2:
        type = "circle";
        break;
      case 3:
        type = "triangle";
        break;
    }

    return {
      type,
      x: Math.random() * (this.settings.width - 10) + 10,
      y: Math.random() * (this.settings.height - 10) + 10,
      color,
    }
  }
}

export default CanvasDraw;
