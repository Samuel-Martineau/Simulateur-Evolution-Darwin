export const getCanvasSize = () => {
  return window.innerHeight < window.innerWidth
    ? window.innerHeight
    : window.innerWidth;
};
