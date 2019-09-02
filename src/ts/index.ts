import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import { getCanvasSize } from './helpers';

const sketch = function(p: p5) {
  const size = 657;
  p.setup = () => {
    p.createCanvas(getCanvasSize(), getCanvasSize());
    p.select('body').style('overflow', 'hidden');
  };
  p.draw = () => {
    p.scale(getCanvasSize() / size);
    p.background(0);
  };
  p.windowResized = () => {
    p.resizeCanvas(getCanvasSize(), getCanvasSize());
  };
};

new p5(sketch);
