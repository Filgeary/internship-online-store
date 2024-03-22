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
        this.shapes = shapes // Инициализируем массив фигур
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
        
        if (this.selectedShape && this.selectedShape.type === 'line') {
            this.startX = this.selectedShape.startX
            this.startY = this.selectedShape.startY
        } else {
            this.startX = mouseX
            this.startY = mouseY
        }

        // Если выбранная фигура - линия, сохраняем ее начальные координаты
        if (this.selectedShape && this.selectedShape.type === 'line') {
            this.selectedShapeStartX = this.selectedShape.startX
            this.selectedShapeStartY = this.selectedShape.startY
            this.selectedShapeEndX = this.selectedShape.endX
            this.selectedShapeEndY = this.selectedShape.endY
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
             } else if (this.selectedShape.type === 'freeDraw') {
                for (const point of this.selectedShape.points) {
                    point.x += deltaX
                    point.y += deltaY
                }
              } else {
                const selected = this.selectedShape as any
                selected.x += deltaX
                selected.y += deltaY
             }

            // Перерисовываем холст
            this.redrawCanvas()

            // Обновляем начальные координаты
            if (this.selectedShape && this.selectedShape.type !== 'line') {
            this.startX = mouseX
            this.startY = mouseY
            }
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
            if(shape.type === 'freeDraw') {
                if (shape.points.length > 1) {
                    this.ctx.beginPath()
                    this.ctx.moveTo(shape.points[0].x, shape.points[0].y)
                    for (let i = 1; i < shape.points.length; i++) {
                        this.ctx.lineTo(shape.points[i].x, shape.points[i].y)
                    }
                    this.ctx.stroke()
                }
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
                        return shape
                    }
                    break
                case 'rectangle':
                    if (x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height) {
                        return shape
                    }
                    break
                case 'line':

                    // Проверяем, находится ли указатель мыши на линии
                const distanceFromStart = Math.sqrt((x - shape.startX) ** 2 + (y - shape.startY) ** 2)
                const distanceFromEnd = Math.sqrt((x - shape.endX) ** 2 + (y - shape.endY) ** 2)
                const length = Math.sqrt((shape.startX - shape.endX) ** 2 + (shape.startY - shape.endY) ** 2)

                // Проверяем, ближе ли указатель мыши к началу или концу линии, с учетом погрешности
                const epsilon = 5 // погрешность
                if (distanceFromStart + distanceFromEnd >= length - epsilon && distanceFromStart + distanceFromEnd <= length + epsilon) {
                  return shape
                }
                      break;
                case 'freeDraw':
                    if (this.isPointInPath(x, y, shape.points)) {
                         return shape
                    }
                      break
                default:
                    break
            }
        }
        return null
    }

    // Метод для определения принадлежности точки пути (используется для freeDraw)
    isPointInPath(x: number, y: number, points: { x: number, y: number }[]) {
    
    if (points.length < 2) return false

    let inside = false
    const epsilon = 1
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i].x, yi = points[i].y
        const xj = points[j].x, yj = points[j].y

        // Добавляем погрешность к границам пути
        const xiMin = Math.min(xi, xj) - epsilon
        const xiMax = Math.max(xi, xj) + epsilon
        const yiMin = Math.min(yi, yj) - epsilon
        const yiMax = Math.max(yi, yj) + epsilon

        // Проверяем, если точка (x, y) находится в окрестности линии
        if (x >= xiMin && x <= xiMax && y >= yiMin && y <= yiMax) return true

        // Проверяем, если точка (x, y) находится между точками i и j
        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi)

        // Инвертируем значение inside, если точка находится между точками i и j
        if (intersect) inside = !inside

        // Если точка совпадает с одной из точек пути, считаем ее внутри фигуры
        if ((xi === x && yi === y) || (xj === x && yj === y)) return true
    }

    return inside
    }
}

export default Pointer