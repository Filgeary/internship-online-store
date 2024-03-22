import Figure from "../figures";
import Rectangle from "../figures/rectangle";
import { Action, DrawOptions, ScrollParams, ZoomParams } from "./types";

class Core {
  // DOM элемент, в котором будет создана канва
  root: HTMLElement | null = null;
  // DOM элемент канвы
  canvas: HTMLCanvasElement | null = null;
  // Контекст для 2D рисования
  ctx: CanvasRenderingContext2D | null = null;
  // Элементы для рендера
  elements: Figure[] = [];
  // Отмененные элементы
  oldElements: Figure[] = [];

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

  hoverItem: Figure | undefined;

  options: DrawOptions = {
    strokeStyle: "#000000",
    lineWidth: 5,
    figure: new Rectangle(),
    isFill: true,
  };

  // Активное действие (обычно при зажатой клавиши мышки)
  action: Action | null = null;

  constructor() {}
  /**
   * Смена опций рисования
   */
  changeOptions(options: Partial<DrawOptions>) {
    this.options = {
      ...this.options,
      ...options,
    };
    this.ctx!.lineCap = "round";
    this.ctx!.strokeStyle = this.options.strokeStyle;
    this.ctx!.lineWidth = this.options.lineWidth;
    this.ctx!.fillStyle = this.options.strokeStyle;
  }

  /**
   * Монтирование канвы в DOM элемент (dom)
   * @param root
   */
  mount(root: HTMLElement) {
    this.root = root;
    this.canvas = document.createElement("canvas");
    this.root.appendChild(this.canvas);

    // Отслеживаем изменение размеров окна (хотя лучше повесить ResizeObserver на root)
    window.addEventListener("resize", this.resize);
    // Нажатие мышки отслеживается только в рамках канвы
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("keydown", this.onKeyDown);
    // Перемещение и отпускание кнопки мышки отслеживаем в рамках всего окна
    // чтобы не ломалась логика, если после нажатия мышь случайна вышла за рамки канвы
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("wheel", this.onMouseWheel);

    this.ctx = this.canvas.getContext("2d", { alpha: false });
    if (this.ctx) {
      this.ctx.imageSmoothingEnabled = false;
      // Актуализация размеров канвы
      this.resize();
      // Запуск цикла рендера
      this.draw();
    } else {
      throw new Error("Не удалось создать CanvasRenderingContext2D");
    }
  }

  /**
   * Демонтирование канвы
   */
  unmount() {
    // Отписка от всех событий
    if (this.canvas) {
      window.removeEventListener("resize", this.resize);
      window.removeEventListener("mousemove", this.onMouseMove);
      window.removeEventListener("mouseup", this.onMouseUp);
      this.canvas.removeEventListener("mousedown", this.onMouseDown);
      window.removeEventListener("keydown", this.onKeyDown);
      this.canvas.removeEventListener("wheel", this.onMouseWheel);
      // Удаление канвы
      if (this.root) this.root.removeChild(this.canvas);
      this.canvas = null;
      this.ctx = null;
    }
  }

  /**
   * Обработка изменения размеров/масштаба под канву
   */
  resize = () => {
    if (this.root && this.canvas && this.ctx) {
      const rect = this.root.getBoundingClientRect();
      this.metrics.left = rect.left;
      this.metrics.top = rect.top;
      this.metrics.width = this.root.offsetWidth;
      this.metrics.height = this.root.offsetHeight;
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

  /**
   * Смещение области обзора (прокрутка по горизонтали и/или вертикали)
   * @param x Точная позиция по горизонтали
   * @param y Точная позиция по вертикали
   * @param dx Добавить смещение по горизонтали
   * @param dy Добавить смещение по вертикали
   */
  scroll({ x, y, dx, dy }: ScrollParams) {
    if (typeof x != "undefined") this.metrics.scrollX = x;
    if (typeof y != "undefined") this.metrics.scrollY = y;
    if (typeof dx != "undefined") this.metrics.scrollX += dx;
    if (typeof dy != "undefined") this.metrics.scrollY += dy;
  }

  /**
   * Установка масштаба
   * @param zoom Точная установка (1 = 100%)
   * @param delta Изменение текущего масштаба на коэффициент, например -0.1
   * @param center Центр масштабирования (точка, которая визуально не сместится)
   */
  zoom({ zoom, delta, center }: ZoomParams) {
    // Центр масштабирования с учётом текущего смещения и масштабирования
    const centerReal = {
      x: (center.x + this.metrics.scrollX) / this.metrics.zoom,
      y: (center.y + this.metrics.scrollY) / this.metrics.zoom,
    };
    // Точная установка масштаба
    if (typeof zoom != "undefined") this.metrics.zoom = zoom;
    // Изменение масштабирования на коэффициент
    if (typeof delta != "undefined")
      this.metrics.zoom += delta * this.metrics.zoom;
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

  onKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key == "z") {
      const element = this.elements.pop();
      if (element) {
        this.oldElements.push(element);
      }
    } else if (e.ctrlKey && e.key == "y") {
      const element = this.oldElements.pop();
      if (element) {
        this.elements.push(element);
      }
    }
  };

  /**
   * Поиск элемента по точке
   * @param x
   * @param y
   */
  findElementByPont({ x, y }: { x: number; y: number }) {
    // for (const element of this.elements) {
    //   if (element.isDragged({ x, y })) {
    //     return element;
    //   }
    // }
    for (let index = this.elements.length - 1; index >= 0; index--) {
      if (this.elements[index].isDragged({ x, y })) {
        return this.elements[index];
      }
    }
    return null;
  }

  findFirstElement = () => {
    if (this.elements.length == 0) {
      return;
    }
    const first = this.elements[0];
    first.x1 = ((0 - this.metrics.left + this.metrics.scrollX) / this.metrics.zoom);
    first.y1 = ((0 - this.metrics.top + this.metrics.scrollY) / this.metrics.zoom);
    first.x2 = first.x1 + 100;
    first.y2 = first.y1 + 100;
    first.width = 100;
    first.height = 100;
  }

  drawRectangles = (count: number) => {
    const point = {
      x: (0 - this.metrics.left + this.metrics.scrollX) / this.metrics.zoom,
      y: (0 - this.metrics.top + this.metrics.scrollY) / this.metrics.zoom,
    };
    const colors = ["#0c9300", "#007272", "#000000", "#150072", "#727000", "#723100"];
    for (let index = 0; index < count; index++) {
      const coord = {
        x1: Math.floor(Math.random() * (point.x + this.metrics.width - point.x) + point.x),
        x2: Math.floor(Math.random() * (point.x + this.metrics.width - point.x) + point.x),
        y1: Math.floor(Math.random() * (point.y + this.metrics.height - point.y) + point.y),
        y2: Math.floor(Math.random() * (point.y + this.metrics.height - point.y) + point.y),
      };
      const rectangle: Figure = new Rectangle();
      this.elements.push(rectangle);
      rectangle.draw(
        this.ctx!,
        {
          startMouseX: coord.x1,
          startMouseY: coord.y1,
          offsetX: coord.x2,
          offsetY: coord.y2,
          fill: true,
        },
        {
          ...this.options,
          isFill: true,
          fillStyle: colors[Math.floor(Math.random() * (colors.length - 0) + 0)]
        }
      );
    }
  };

  onMouseDown = (e: MouseEvent) => {
    // Курсор с учётом масштабирования и скролла
    const point = {
      x:
        (e.clientX - this.metrics.left + this.metrics.scrollX) /
        this.metrics.zoom,
      y:
        (e.clientY - this.metrics.top + this.metrics.scrollY) /
        this.metrics.zoom,
    };

    if (e.shiftKey) {
      // Перемещение канвы (scroll)
      this.action = {
        name: "scroll",
        // Координата, с которой начинаем расчёт смещения (учитывать зум не нужно)
        x: e.clientX - this.metrics.left,
        y: e.clientY - this.metrics.top,
        // Запоминаем исходное смещение, чтобы к нему добавлять расчётное
        targetX: this.metrics.scrollX,
        targetY: this.metrics.scrollY,
      };
    } else if (e.ctrlKey) {
      const element = this.findElementByPont(point);
      if (element) {
        // Перемещение фигуры (drag&drop)
        this.action = {
          name: "drag",
          element,
          // Координата, с которой начинаем расчёт смещения
          x: point.x,
          y: point.y,
          // Координаты фигуры
          targetX: element.x1,
          targetY: element.y1,
        };
      }
    } else {
      this.oldElements = [];
      const element = Object.create(this.options.figure);
      this.elements.push(element);
      this.action = {
        name: "draw",
        // Координата, с которой начинаем расчёт смещения
        x: point.x,
        y: point.y,
        targetX: 0,
        targetY: 0,
        element,
      };
    }
  };

  onMouseMove = (e: MouseEvent) => {
    const point = {
      x:
        (e.clientX - this.metrics.left + this.metrics.scrollX) /
        this.metrics.zoom,
      y:
        (e.clientY - this.metrics.top + this.metrics.scrollY) /
        this.metrics.zoom,
    };

    if (this.action?.name === "drag" && this.action.element) {
      this.action.element.setPosition({
        x: this.action.targetX + point.x - this.action.x,
        y: this.action.targetY + point.y - this.action.y,
      });
    } 
    // Обработка действия scroll
    else if (this.action?.name === "scroll") {
      // Скролл использует не масштабированную точку, так как сам же на неё повлиял бы
      this.scroll({
        x:
          this.action.targetX - (e.clientX - this.metrics.left - this.action.x),
        y: this.action.targetY - (e.clientY - this.metrics.top - this.action.y),
      });
    }
    else if (this.action?.name === "draw") {
      this.action.element!.draw(
        this.ctx!,
        {
          offsetX: point.x,
          offsetY: point.y,
          fill: this.options.isFill,
          startMouseX: this.action?.x,
          startMouseY: this.action?.y,
        },
        this.options
      );
    } else {
      const element = this.findElementByPont(point);
      this.hoverItem = element ?? undefined;
    }
  };

  onMouseUp = (e: MouseEvent) => {
    if (this.action?.name === "draw") {
      this.ctx?.closePath();
    }
    this.action = null;
  };

  onMouseWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    if (e.ctrlKey) {
      // Масштабирование
      this.zoom({ delta, center: { x: e.offsetX, y: e.offsetY } });
    } else {
      // Прокрутка по вертикали
      this.scroll({ dy: delta * 300 });
    }
  };

  /**
   * Рисование всего
   */
  draw = () => {
    if (this.ctx) {
      // Область рендера
      const viewRect = {
        x1: this.metrics.scrollX / this.metrics.zoom,
        y1: this.metrics.scrollY / this.metrics.zoom,
        x2: (this.metrics.width + this.metrics.scrollX) / this.metrics.zoom,
        y2: (this.metrics.height + this.metrics.scrollY) / this.metrics.zoom,
      };

      this.ctx.save();
      // Очистка
      this.ctx.fillStyle = "#ebf4ff";
      this.ctx.fillRect(0, 0, this.metrics.width, this.metrics.height);
      // scroll
      this.ctx.translate(-this.metrics.scrollX, -this.metrics.scrollY);
      // scale
      this.ctx.scale(this.metrics.zoom, this.metrics.zoom);

      for (const element of this.elements) {
        if (this.hoverItem === element && element.drawOptions) {
          const options = element.drawOptions;
          element.drawOptions = {
            ...element.drawOptions,
            fillStyle: "#212121",
          };
          element.render();
          element.drawOptions = options;
        } else {
          element.render();
        }
      }
      this.ctx.restore();

      // Цикл рендера
      requestAnimationFrame(this.draw);
    }
  };
}

export default Core;
