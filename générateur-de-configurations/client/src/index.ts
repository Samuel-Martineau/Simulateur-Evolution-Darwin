import p5 from 'p5';
import { createAnimals, initiateGlobalVariables } from './setup';

const sketch = (p: p5) => {
  p.preload = () => initiateGlobalVariables(p);
  p.setup = () => {
    p.randomSeed(123456789);
    p.noCanvas();
    createAnimals();
  };
  p.draw = () => {
    for (let i = 0; i < window.speed; i++) {
      window.animals.forEach((animal) => animal.update());
      window.time++;
    }
    if (window.nbOfPreys <= 0 || window.nbOfPredators <= 0 || window.time > 100000) done();
  };
};

new p5(sketch);

function done() {
  // @ts-ignore
  window.done(window.time, window.preyConfig, window.predatorConfig);
  initiateGlobalVariables(window.p5);
  createAnimals();
}
