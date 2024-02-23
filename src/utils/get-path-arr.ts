export const getPathArr = (path: string) => {
  return path.split('|').filter(item => item);
}
