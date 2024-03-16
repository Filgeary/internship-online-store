export interface IFigure {
  init: () => void;
  draw: () => void;
  updatePosition: ({ dx, dy }: { dx: number; dy: number }) => void;
  select: () => void;
  unselect: () => void;
  getFigurePath: () => Path2D;
  setFigurePath: (figurePath: Path2D) => void;
}
