import StoreModule from "../module"
import Tool from "@src/app/drawing/tools/tool"
import { ICircle, IRectangle, ILine, IFreeDraw, Shape } from "./types"

interface ICanvasState {
  canvas: HTMLCanvasElement | null
  tool: Tool | null
  undoList: string[]
  redoList: string[]
  nameTool: string
  figures: (ICircle | IRectangle | ILine | IFreeDraw)[]
}

class CanvasState extends StoreModule<ICanvasState> {
  /**
   * Начальное состояние
   * @return {Object}
   */
  initState(): ICanvasState {
    return {
      canvas: null,
      tool: null,
      undoList: [], // Хранение выполненных действий на canvas
      redoList: [],  // Хранение действий на canvas, которые отменили
      nameTool: 'freeDraw', // Название инструмента
      figures: []
    }
  }

  /**
   * Добавление canvas
   */
  setCannvas(canvas: HTMLCanvasElement) {
    this.setState({
      ...this.getState(),
      canvas: canvas
  })
}

  /**
   * Добавление инструмента
   */
  setTool(tool: Tool, name: string) {
    this.setState({
      ...this.getState(),
      tool: tool,
      nameTool: name
  })
}

  /**
   * Изменение цвета 
   */
  setFillColor(color: string) {
    const currentTool = this.getState().tool
    if (currentTool) currentTool.fillColor = color
    this.setState({
      ...this.getState(),
      tool: currentTool
    })
  }

  /**
   * Изменение обводки 
   */
  setStrokeColor(color: string) {
    const currentTool = this.getState().tool
    if (currentTool) currentTool.strokeColor = color
    this.setState({
      ...this.getState(),
      tool: currentTool
    })
  }

  /**
   * Изменение ширины
   */
  setLineWidth(width: number) {
    const currentTool = this.getState().tool
    if (currentTool) currentTool.lineWidth = width
    this.setState({
      ...this.getState(),
      tool: currentTool
    })
  }

  /**
   * Добавление действий в массив "undoList"
   */
  pushToUndo(data: any) {
    this.setState({
      ...this.getState(),
      undoList: [...this.getState().undoList, data]
    })
  }

  /**
   * Добавление действий, которые отменили
   */
  pushToRedo(data: any) {
    this.setState({
      ...this.getState(),
      redoList: [...this.getState().redoList, data]
    })
  }

  /**
   * Отмена последнего действия
   */
  undo() {
    let ctx = this.getState().canvas!.getContext('2d') as CanvasRenderingContext2D
    if (this.getState().undoList.length > 0) {
        let dataUrl = this.getState().undoList.pop() // Получаем последнее действие
        this.getState().redoList.push(this.getState().canvas!.toDataURL())
        const img = new Image()
        img.src = dataUrl as string
        img.onload = () => {
            ctx.clearRect(0,0, this.getState().canvas!.width, this.getState().canvas!.height)
            ctx.drawImage(img, 0, 0, this.getState().canvas!.width, this.getState().canvas!.height)
        }
    } else {
        ctx.clearRect(0, 0, this.getState().canvas!.width, this.getState().canvas!.height)
    }
  }

  /**
   * Возврат последнего действия
   */
  redo() {
    let ctx = this.getState().canvas!.getContext('2d') as CanvasRenderingContext2D
    if (this.getState().redoList.length > 0) {
        let dataUrl = this.getState().redoList.pop()
        this.getState().undoList.push(this.getState().canvas!.toDataURL())
        let img = new Image()
        img.src = dataUrl as string
        img.onload =  () => {
            ctx.clearRect(0,0, this.getState().canvas!.width, this.getState().canvas!.height)
            ctx.drawImage(img, 0, 0, this.getState().canvas!.width, this.getState().canvas!.height)
        }
    }
}

  /**
   * Сохранение фигур
   */
  setFigures() {
    const figures = this.getState().tool!.allFiguresTool as any
    this.setState({
      ...this.getState(),
      figures: [...this.getState().figures, ...figures]
  })
}
}

export default CanvasState
