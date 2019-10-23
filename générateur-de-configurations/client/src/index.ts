import p5 from 'p5';
import { createAnimals, initiateGlobalVariables } from './setup';

const sketch = (p: p5) => {
  p.preload = () => initiateGlobalVariables(p);
  p.setup = () => {
    p.noCanvas();
    p.frameRate(30);
    createAnimals();
  };
  p.draw = () => {
    for (let i = 0; i < window.speed; i++) {
      window.animals.forEach((animal) => animal.update());
      window.time++;
    }
    const nbOfPreys = window.animals.filter((a) => a.specie === 0).length;
    const nbOfPredators = window.animals.length - nbOfPreys;
    if (!nbOfPreys || !nbOfPredators) done();
    if (window.time > 25000) done();
  };
};

new p5(sketch);

const done = () => {
  //@ts-ignore
  window.done(window.time, window.preyConfig, window.predatorConfig);
  initiateGlobalVariables(window.p5);
  createAnimals();
};
