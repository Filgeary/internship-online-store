import Tool from '../tool'
import { ICircle, IRectangle, ILine, IFreeDraw, Shape } from '@src/store/canvas/types'

class Pointer extends Tool {
    canvas!: HTMLCanvasElement | null // Ссылка на элемент canvas
    mouseDown!: boolean // Флаг, указывающий, нажата ли кнопка мыши
    startX!: number
    startY!: number
    selectedShape: Shape = null // Выбранная фигура для перемещения
    shapes: (ICircle | IRectangle | ILine | IFreeDraw)[] | null // Массив фигур для отображения
    selectedShapeStartX!: number
    selectedShapeStartY!: number
    selectedShapeEndX!: number
    selectedShapeEndY!: number

    constructor(canvas: HTMLCanvasElement | null, shapes: (ICircle | IRectangle | ILine | IFreeDraw)[] | null) {
        super(canvas) // Вызываем конструктор родительского класса
        this.shapes = shapes; // Инициализируем массив фигур
        this.listen() // Устанавливаем обработчики событий для перемещения фигур
    }
    
    listen() {
       if(this.canvas) {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
       }
    }

    // Обработчик события отпускания кнопки мыши
    mouseUpHandler(e: MouseEvent) {
        this.mouseDown = false
        this.selectedShape = null // Сбрасываем выбранную фигуру после отпускания кнопки мыши
    }

    // Обработчик события нажатия кнопки мыши
    mouseDownHandler(e: MouseEvent) {
        this.mouseDown = true
        const rect = this.canvas!.getBoundingClientRect()
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        
        // Проверяем, есть ли фигура в точке клика
        this.selectedShape = this.getShapeAtPosition(mouseX, mouseY)
        
        if (this.selectedShape) {
            this.startX = mouseX
            this.startY = mouseY
        }

        // Если выбранная фигура - линия, сохраняем ее начальные координаты
        if (this.selectedShape && this.selectedShape.type === 'line') {
            this.selectedShapeStartX = this.selectedShape.startX;
            this.selectedShapeStartY = this.selectedShape.startY;
            this.selectedShapeEndX = this.selectedShape.endX;
            this.selectedShapeEndY = this.selectedShape.endY;
        }
    }

    // Обработчик события перемещения мыши
    mouseMoveHandler(e: MouseEvent) {
        if (this.mouseDown && this.selectedShape) {
            const rect = this.canvas!.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top
            
            const deltaX = mouseX - this.startX
            const deltaY = mouseY - this.startY

             // Обновляем координаты 
             if(this.selectedShape.type === 'line') {
                this.selectedShape.startX = this.selectedShapeStartX + deltaX
                this.selectedShape.startY = this.selectedShapeStartY + deltaY
                this.selectedShape.endX = this.selectedShapeEndX + deltaX
                this.selectedShape.endY = this.selectedShapeEndY + deltaY
             } else {
                const selected = this.selectedShape as any
                selected.x += deltaX
                selected.y += deltaY
             }

            // Перерисовываем холст
            this.redrawCanvas()
            
            // Обновляем начальные координаты
            this.startX = mouseX
            this.startY = mouseY
        }
    }

    redrawCanvas() {
        if (!this.canvas || !this.ctx || !this.shapes) return
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) // Очищаем холст
        
        // Перерисовываем все фигуры
        for (const shape of this.shapes) {
            if (shape.type === 'circle') {
                this.ctx.beginPath()
                this.ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI)
                this.ctx.fill()
                this.ctx.stroke()
            }
            if (shape.type === 'rectangle') {
                this.ctx.beginPath()
                this.ctx.rect(shape.x, shape.y, shape.width, shape.height)
                this.ctx.fill()
                this.ctx.stroke()
            }
            if (shape.type === 'line') {
                this.ctx.beginPath()
                this.ctx.moveTo(shape.startX, shape.startY)
                this.ctx.lineTo(shape.endX, shape.endY)
                this.ctx.stroke()
            }
        }
    }

    // Метод для определения фигуры в заданной точке
    getShapeAtPosition(x: number, y: number) {
        // Проходим по массиву фигур и проверяем, есть ли фигура в заданной точке
        if(this.shapes) for (const shape of this.shapes) {
            switch (shape.type) {
                case 'circle':
                    const distance = Math.sqrt((x - shape.x) ** 2 + (y - shape.y) ** 2)
                    if (distance <= shape.radius) {
                        return shape;
                    }
                    break;
                case 'rectangle':
                    if (x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height) {
                        return shape;
                    }
                    break;
                case 'line':

                //     // Проверяем, находится ли указатель мыши на линии
                // const distanceFromStart = Math.sqrt((x - shape.startX) ** 2 + (y - shape.startY) ** 2)
                // const distanceFromEnd = Math.sqrt((x - shape.endX) ** 2 + (y - shape.endY) ** 2)
                // const length = Math.sqrt((shape.startX - shape.endX) ** 2 + (shape.startY - shape.endY) ** 2)

                // // Проверяем, ближе ли указатель мыши к началу или концу линии, с учетом погрешности
                // const epsilon = 5; // погрешность
                // if (distanceFromStart + distanceFromEnd >= length - epsilon && distanceFromStart + distanceFromEnd <= length + epsilon) {
                //   return shape
                // }

                // Проверяем, находится ли точка на линии
                const onLine = this.isPointOnLine(x, y, shape.startX, shape.startY, shape.endX, shape.endY);
                if (onLine) {
                    return shape;
                }
                      break;
                case 'freeDraw':
                    if (this.isPointInPath(x, y, shape.points)) {
                         return shape;
                    }
                      break;
                default:
                    break;
            }
        }
        return null;
    }
    
    isPointOnLine(x: number, y: number, x1: number, y1: number, x2: number, y2: number) {
        // Проверяем, лежит ли точка в пределах отрезка, а не только на нем
        const dxc = x - x1;
        const dyc = y - y1;
        const dxl = x2 - x1;
        const dyl = y2 - y1;
    
        const cross = dxc * dyl - dyc * dxl;
        if (cross !== 0) return false;
    
        if (Math.abs(dxl) >= Math.abs(dyl)) {
            return dxl > 0 ? (x1 <= x && x <= x2) || (x2 <= x && x <= x1) : (x2 <= x && x <= x1) || (x1 <= x && x <= x2);
        } else {
            return dyl > 0 ? (y1 <= y && y <= y2) || (y2 <= y && y <= y1) : (y2 <= y && y <= y1) || (y1 <= y && y <= y2);
        }
    }

    // Метод для определения принадлежности точки пути (используется для freeDraw)
    isPointInPath(x: number, y: number, points: { x: number, y: number }[]) {
        if (points.length < 2) return false;

        let inside = false;
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            const xi = points[i].x, yi = points[i].y;
            const xj = points[j].x, yj = points[j].y;

            const intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    }
}

export default Pointer