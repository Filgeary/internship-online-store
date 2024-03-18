export type Shape = ICircle | IRectangle | ILine | IFreeDraw | null

export interface ICircle {
    type: 'circle';
    x: number;
    y: number;
    radius: number;
}

export interface IRectangle {
    type: 'rectangle';
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ILine {
    type: 'line';
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export interface IFreeDraw {
    type: 'freeDraw';
    points: { x: number, y: number }[];
}