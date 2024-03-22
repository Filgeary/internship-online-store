import * as figures from "./shapes/exports";
import { getPaddingSize } from "@src/utils/get-padding-size";
import { Action, Options, ScrollParams, ZoomParams } from "./type";
import { FiguresNames, ShapeInstance } from "./shapes/type";
import { Ball } from "./shapes/ball";
import randomIntFromRange from "@src/utils/random-range";

class Core {
  // DOM элемент, в котором будет создана канва
  root: HTMLElement | null = null;
  // DOM элемент канвы
  canvas: HTMLCanvasElement | null = null;
  // Контекст для 2D рисования
  ctx: CanvasRenderingContext2D | null = null;
  // Элементы для рендера
  shapes: ShapeInstance[] = [];
  currentShape: ShapeInstance | null = null;
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
  balls: Ball[] = []

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
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("wheel", this.onMouseWheel);

    this.ctx = this.canvas.getContext("2d", {
      willReadFrequently: true,
      alpha: false,
    });
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = false;
      this.resize();
      this.reDraw();
      this.generate();
      // this.resizeObserver = new ResizeObserver(this.resize);
      // this.resizeObserver.observe(this.root, {box: "content-box"});
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
      this.canvas.removeEventListener("wheel", this.onMouseWheel);
      // Удаление канвы
      if (this.root) this.root.removeChild(this.canvas);
      this.canvas = null;
      this.ctx = null;
    }
  }

  private resize = () => {
    if (this.root && this.canvas && this.ctx) {
      const rect = this.root.getBoundingClientRect();
      const { paddingTop, paddingRight, paddingBottom, paddingLeft } =
        getPaddingSize(this.root);
      this.metrics.left = rect.left + paddingLeft;
      this.metrics.top = rect.top + paddingTop;
      this.metrics.width = rect.width - paddingRight - paddingLeft;
      this.metrics.height = rect.height - paddingTop - paddingBottom;
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

  private scroll({ x, y, dx, dy }: ScrollParams) {
    if (x) this.metrics.scrollX = x;
    if (y) this.metrics.scrollY = y;
    if (dx) this.metrics.scrollX += dx; //добавляется смещение по горизонтали
    if (dy) this.metrics.scrollY += dy; //добавляется смещение по вертикали
  }

  private zoom({ center, zoom, delta }: ZoomParams) {
    // Центр масштабирования с учётом текущего смещения и масштабирования
    const centerReal = {
      x: (center.x + this.metrics.scrollX) / this.metrics.zoom,
      y: (center.y + this.metrics.scrollY) / this.metrics.zoom,
    };
    // Точная установка масштаба
    if (zoom) this.metrics.zoom = zoom;
    // Изменение масштабирования на коэффициент
    if (delta) this.metrics.zoom += delta * this.metrics.zoom;
    // Корректировка минимального масштаба
    this.metrics.zoom = Math.max(0.1, this.metrics.zoom);
    // Центр масштабирования с учётом нового масштаба
    const centerNew = {
      x: centerReal.x * this.metrics.zoom,
      y: centerReal.y * this.metrics.zoom,
    };
    // Корректировка смещения
    this.scroll({
      x: centerNew.x - center.x,
      y: centerNew.y - center.y,
    });
  }

  startDrawing(x: number, y: number) {
    if (this.canvas && this.ctx) {
      //Получение пиксельных данных для контекста
      this.snapshot = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.isDrawing = true;
      const shape = this.options.figure as FiguresNames;
      const isFill = shape === "pencil" || shape === "eraser" || shape === "line";
      if(isFill) {
        this.currentShape = new figures[shape](
          this.options.stroke,
          this.options.color,
          x,
          y,
          x,
          y
        );
      } else {
        this.currentShape = new figures[shape](
          this.options.stroke,
          this.options.color,
          x,
          y,
          x,
          y,
          this.options.fill
        );
      }
      this.shapes.push(this.currentShape);
    }
  }

  private onMouseDown = (e: MouseEvent) => {
    const point = this.transformPoint(e);
    if (this.options.draw) {
      this.startDrawing(point.x, point.y);
    } else {
      for (let shape of this.shapes.reverse()) {
        if (shape.mouseInShape(point.x, point.y)) {
          this.action = {
            name: "drag",
            x: point.x,
            y: point.y,
            targetX: shape.startX,
            targetY: shape.startY,
            element: shape,
          };
          break;
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
      this.shapes.reverse();
    }
  };

  private onMouseUp = () => {
    if (this.options.draw) {
      this.isDrawing = false;
      if (this.currentShape) {
        this.currentShape = null;
      }
    }
    this.action = null;
  };

  private onMouseMove = (e: MouseEvent) => {
    const point = this.transformPoint(e);
    if (this.options.draw) {
      this.draw(point.x, point.y);
    } else {
      if(this.action){
        if (this.action.name === "drag" && this.action.element && this.canvas) {
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
  };

  private onMouseWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.1 : -0.1;
    if (e.ctrlKey) {
      // Масштабирование
      this.zoom({ center: { x: e.offsetX, y: e.offsetY }, delta });
    } else {
      // Прокрутка по вертикали
      this.scroll({ dy: delta * 300 });
    }
  };

  private dragShape(element: ShapeInstance, x: number, y: number) {
    if (this.ctx) {
      this.ctx.save();
      element.move(x, y);
      this.reDraw();
      this.ctx.restore();
    }
  }

  private draw = (offsetX: number, offsetY: number) => {
    if (!this.isDrawing) return;
    this.reDraw();
    if (this.ctx && this.snapshot) {
      //добавление скопированных данных канваса
      this.ctx.putImageData(this.snapshot, 0, 0);
      this.ctx.save();
      if (this.currentShape) {
        this.currentShape.changePath(offsetX, offsetY);
        this.shapes.splice(-1, 1, this.currentShape);
      }
      this.ctx.restore();
    }
  };

  private reDraw = () => {
    if (this.ctx) {
      this.ctx.save();
      this.ctx.fillStyle = "#fff";
      this.ctx.fillRect(0, 0, this.metrics.width, this.metrics.height);
      this.ctx.translate(-this.metrics.scrollX, -this.metrics.scrollY);
      this.ctx.scale(this.metrics.zoom, this.metrics.zoom);
      for (let shape of this.shapes) {
        this.ctx.save();
        shape.draw(this.ctx);
        this.ctx.restore();
      }
      this.ctx.restore();
      requestAnimationFrame(this.reDraw);
    }
  };

  private transformPoint(e: MouseEvent) {
    return {
      x: Math.round(
        (e.clientX - this.metrics.left + this.metrics.scrollX) /
          this.metrics.zoom
      ),
      y: Math.round(
        (e.clientY - this.metrics.top + this.metrics.scrollY) /
          this.metrics.zoom
      ),
    };
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

  generate() {
    this.balls = [];
    for (let i = 0; i < 600; i++) {
      const radius = randomIntFromRange(8, 20);
      const x = randomIntFromRange(radius, this.metrics.width - radius);
      const y = randomIntFromRange(0, this.metrics.height - radius);
      const dx = randomIntFromRange(-3, 3)
      const dy = randomIntFromRange(-2, 2)
      this.balls.push(new Ball(x, y, dx, dy, radius));
	  }
    this.animate();
  }

  animate = () => {
	  requestAnimationFrame(this.animate);
    if(this.ctx) {
	    this.ctx.clearRect(0, 0, this.metrics.width, this.metrics.height);
      for (let i = 0; i < this.balls.length; i++) {
        const ball = this.balls[i] as Ball;
        ball.update(this.ctx, this.metrics.height, this.metrics.width);
      }
    }
  }
}

export default Core;
//для оптимизации рендеринга с множеством элементов разбивать на кусочки шахматная доска
