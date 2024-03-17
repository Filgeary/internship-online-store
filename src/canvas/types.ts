export interface IFigure {
  init: () => void;
  draw: () => void;
  updatePosition: ({ deltaX, deltaY }: { deltaX: number; deltaY: number }) => void;
  select: () => void;
  unselect: () => void;
  getFigurePath: () => Path2D;
  setFigurePath: (figurePath: Path2D) => void;
}
