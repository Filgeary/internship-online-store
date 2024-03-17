import { Action, Figures, Options, Points, ScrollParams } from "./type";
import * as figures from "./shapes/exports";
import { getPaddingSize } from "@src/utils/get-padding-size";

class Core {
  // DOM элемент, в котором будет создана канва
  root: HTMLElement | null = null;
  // DOM элемент канвы
  canvas: HTMLCanvasElement | null = null;
  // Контекст для 2D рисования
  ctx: CanvasRenderingContext2D | null = null;
  // Элементы для рендера
  shapes: Figures[] = [];
  elements: Figures[] = [];
  //флаг для отрисовки элемента
  isDrawing: boolean = false;
  resizeObserver: ResizeObserver | null = null;
  options = {
    color: "#000000",
    stroke: 2,
    figure: "pencil",
    fill: false,
    draw: true,
  };

  //начальные координаты
  startCoords: Points = {
    x: 0,
    y: 0,
  };

  //снимок канвы
  snapshot: ImageData | null = null;
  // Метрики канвы
  metrics = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    dpr: 1,
    scrollX: 0,
    scrollY: 0,
    zoom: 1,
  };

  action: Action | null = null;

  mount(root: HTMLElement) {
    this.root = root;
    this.canvas = document.createElement("canvas");
    this.root.appendChild(this.canvas);
    // Отслеживаем изменение размеров окна (хотя лучше повесить ResizeObserver на root)
    window.addEventListener("resize", this.resize);
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));

    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = false;
      this.resize();
      this.reDraw();
      // this.resizeObserver = new ResizeObserver(this.resize);
      // this.resizeObserver.observe(this.root);
    }
  }

  unmount() {
    // Отписка от всех событий
    if (this.canvas) {
      // this.resizeObserver.disconnect();
      window.removeEventListener("resize", this.resize);
      this.canvas.removeEventListener("mousedown", this.onMouseDown);
      this.canvas.addEventListener("mousemove", this.onMouseMove);
      this.canvas.addEventListener("mouseup", this.onMouseUp);
      // Удаление канвы
      if (this.root) this.root.removeChild(this.canvas);
      this.canvas = null;
      this.ctx = null;
    }
  }

  resize = () => {
    if (this.root && this.canvas && this.ctx) {
      const rect = this.root.getBoundingClientRect();
      this.metrics.left = rect.left;
      this.metrics.top = rect.top;
      const { paddingTop, paddingRight, paddingBottom, paddingLeft } =
        getPaddingSize(this.root);
      this.metrics.width = this.root.offsetWidth - paddingRight - paddingLeft;
      this.metrics.height = this.root.offsetHeight - paddingTop - paddingBottom;
      this.metrics.dpr = window.devicePixelRatio;
      // Физический размер канвы с учётом плотности пикселей (т.е. канва может быть в разы больше)
      this.canvas.width = this.metrics.width * this.metrics.dpr;
      this.canvas.height = this.metrics.height * this.metrics.dpr;
      // Фактический размер канвы
      this.canvas.style.width = `${this.metrics.width}px`;
      this.canvas.style.height = `${this.metrics.height}px`;
      // Общая трансформация - все координаты будут увеличиваться на dpr, чтобы фигуры рисовались в увеличенном (в физическом) размере
      this.ctx.scale(this.metrics.dpr, this.metrics.dpr);
    }
  };

  changeOptions(options: Options) {
    this.options = options;
  }

  scroll({ x, y, dx, dy }: ScrollParams) {
    if (typeof x != "undefined") this.metrics.scrollX = x;
    if (typeof y != "undefined") this.metrics.scrollY = y;
    if (typeof dx != "undefined") this.metrics.scrollX += dx; //добавлвяется смещение по горизонтали
    if (typeof dy != "undefined") this.metrics.scrollY += dy; //добавлвяется смещение по вертикали
  }

  startDrawing() {
    if (this.ctx && this.canvas) {
      this.ctx.beginPath();
      //копирование данных канваса и передача их в качестве снимка
      this.snapshot = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }
    this.isDrawing = true;
  }

  onMouseDown = (e: MouseEvent) => {
    this.startCoords = { x: e.offsetX, y: e.offsetY };
    if (this.options.draw) {
      this.startDrawing();
    } else {
      for (let shape of this.shapes) {
        if (shape.mouseInShape(e.offsetX, e.offsetY)) {
          const point = {
            x:
              (e.clientX - this.metrics.left + this.metrics.scrollX) /
              this.metrics.zoom,
            y:
              (e.clientY - this.metrics.top + this.metrics.scrollY) /
              this.metrics.zoom,
          };
          this.action = {
            name: "drag",
            x: point.x,
            y: point.y,
            targetX: shape.startX,
            targetY: shape.startY,
            element: shape,
          };
        } else {
          this.action = {
            name: "scroll",
            // Координата, с которой начинаем расчёт смещения (учитывать зум не нужно)
            x: e.clientX - this.metrics.left,
            y: e.clientY - this.metrics.top,
            // Запоминаем исходное смещение, чтобы к нему добавлять расчётное
            targetX: this.metrics.scrollX,
            targetY: this.metrics.scrollY,
          };
        }
      }
    }
  };

  finishDrawing() {
    if (this.ctx) this.ctx.closePath();
    this.isDrawing = false;
    if (this.elements.length) {
      this.shapes.push(...this.elements.slice(-1));
      this.elements = [];
    }
  }

  onMouseUp() {
    if (this.options.draw) {
      this.finishDrawing();
    } else {
      this.action = null;
    }
  }

  onMouseMove(e: MouseEvent) {
    if (this.options.draw) {
      this.draw(e.offsetX, e.offsetY);
    } else {
      const point = {
        x:
          (e.clientX - this.metrics.left + this.metrics.scrollX) /
          this.metrics.zoom,
        y:
          (e.clientY - this.metrics.top + this.metrics.scrollY) /
          this.metrics.zoom,
      };
      if (this.action) {
        if (this.action.name === "drag" && this.action.element) {
          this.dragShape(
            this.action.element,
            this.action.targetX + point.x - this.action.x,
            this.action.targetY + point.y - this.action.y
          );
        } else if (this.action.name === "scroll") {
          // Скролл использует не масштабированную точку, так как сам же на неё повлиял бы
          this.scroll({
            x:
              this.action.targetX -
              (e.clientX - this.metrics.left - this.action.x),
            y:
              this.action.targetY -
              (e.clientY - this.metrics.top - this.action.y),
          });
        }
      }
    }
  }

  dragShape(element: Figures, x: number, y: number) {
    if (this.ctx) {
      this.ctx.save();
      element.move(x, y);
      this.reDraw();
      this.ctx.restore();
    }
  }

  draw(offsetX: number, offsetY: number) {
    if (!this.isDrawing) return;
    this.reDraw();
    if (this.ctx && this.snapshot) {
      //добавление скопированных данных канваса
      this.ctx.putImageData(this.snapshot, 0, 0);
      this.ctx.save();
      this.drawShape(offsetX, offsetY);
      this.ctx.restore();
    }
  }

  reDraw = () => {
    if (this.ctx) {
      this.ctx.save();
      this.ctx.clearRect(0, 0, this.metrics.width, this.metrics.height);
      for (let shape of this.shapes) {
        shape.draw();
      }
      this.ctx.restore();
      // requestAnimationFrame(this.reDraw);
    }
  };

  drawShape(offsetX: number, offsetY: number) {
    if (this.ctx)
      switch (this.options.figure) {
        case "line": {
          const line = new figures.line(
            this.options.stroke,
            this.options.color,
            this.ctx,
            offsetX,
            offsetY,
            this.startCoords.x,
            this.startCoords.y
          );
          line.draw();
          this.elements.push(line);
          break;
        }
        case "pencil": {
          const pencil = new figures.pencil(
            this.options.stroke,
            this.options.color,
            this.ctx,
            offsetX,
            offsetY
          );
          pencil.draw();
          break;
        }
        case "eraser": {
          const eraser = new figures.eraser(
            this.options.stroke,
            this.options.color,
            this.ctx,
            offsetX,
            offsetY
          );
          eraser.draw();
          break;
        }
        case "rectangle": {
          const rectangle = new figures.rectangle(
            this.options.stroke,
            this.options.color,
            this.options.fill,
            this.ctx,
            offsetX,
            offsetY,
            this.startCoords.x,
            this.startCoords.y
          );
          rectangle.draw();
          this.elements.push(rectangle);
          break;
        }
        case "circle": {
          const circle = new figures.circle(
            this.options.stroke,
            this.options.color,
            this.options.fill,
            this.ctx,
            offsetX,
            offsetY,
            this.startCoords.x,
            this.startCoords.y
          );
          this.elements.push(circle);
          circle.draw();
          break;
        }
        case "triangle": {
          const triangle = new figures.triangle(
            this.options.stroke,
            this.options.color,
            this.options.fill,
            this.ctx,
            offsetX,
            offsetY,
            this.startCoords.x,
            this.startCoords.y
          );
          this.elements.push(triangle);
          triangle.draw();
          break;
        }
      }
  }

  onClear() {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.shapes = [];
    }
  }

  onSave() {
    if (this.canvas) {
      const link = document.createElement("a");
      link.download = `${Date.now()}.jpg`;
      link.href = this.canvas.toDataURL();
      link.click();
    }
  }
}

export default Core;
