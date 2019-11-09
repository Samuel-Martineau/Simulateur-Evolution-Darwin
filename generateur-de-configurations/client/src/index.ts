import p5 from 'p5';
import { createAnimals, initiateGlobalVariables } from './setup';
import { createPlant } from './helpers';

const sketch = (p: p5) => {
  p.preload = () => initiateGlobalVariables(p);
  p.setup = () => {
    p.imageMode('center');
    p.noCanvas();
    createAnimals();
    for (let i = 0; i < window.plantConfig.startingNb; i++) createPlant();
  };
  p.draw = () => {
    for (let i = 0; i < window.speed; i++) {
      if (window.time % window.plantConfig.reproductionSpeed === 0) createPlant();
      window.animals.forEach((animal) => animal.update());
      window.time++;
      const nbOfPreys = window.animals.filter((a) => a.specie === 0).length;
      const nbOfPredators = window.animals.length - nbOfPreys;
      const nbOfPlants = window.plants.length;
      //@ts-ignore
      window.frame(window.time, nbOfPlants, nbOfPredators, nbOfPreys);
      if (nbOfPreys <= 0 || nbOfPredators <= 0 || window.time > 100000) done();
    }
  };
};

new p5(sketch);

function done() {
  //@ts-ignore
  window.done(window.time, window.plantConfig, window.predatorConfig, window.preyConfig);
  initiateGlobalVariables(window.p5);
  createAnimals();
}
