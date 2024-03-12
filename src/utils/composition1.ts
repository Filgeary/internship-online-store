const text1 = () => ({
  x: 380,
  y: 120,
  color: 'cyan',
  text: 'Hello, Canvas!',
  fontSize: 80,
});
const circle1 = ({ width, height }: { width: number; height: number }) => ({
  x: width / 2,
  y: height * 0.75,
  color: 'lime',
  radius: 50,
});
const rect1 = ({ height }: { height: number }) => ({
  x: 355,
  y: height * 0.59,
  color: 'red',
  width: 150,
  height: 102,
});
const triangle1 = () => ({
  color: 'dodgerblue',
  point1: { x: 550, y: 440 },
  point2: { x: 650, y: 340 },
  point3: { x: 700, y: 490 },
});
const line1 = ({ height }: { height: number }) => ({
  color: 'yellow',
  lineWidth: 12,
  startPoint: { x: 355, y: height * 0.69 },
  endPoint: { x: 905, y: height * 0.7 },
});

export const composition1 = {
  createText: text1,
  createCircle: circle1,
  createRect: rect1,
  createTriangle: triangle1,
  createLine: line1,
};
