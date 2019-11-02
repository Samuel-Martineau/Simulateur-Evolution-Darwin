import p5 from 'p5';
import { stdDev } from './helpers';
import Predator from './animal/predator.class';
import Prey from './animal/prey.class';
import _ from 'lodash';

export const createAnimals = () => {
  for (let i = 0; i < window.preyConfig.startingNb; i++) {
    window.animals.push(
      new Prey({
        x: window.p5.random(0, window.size),
        y: window.p5.random(0, window.size),
        genes: [
          {
            displayName: 'Vitesse',
            name: 'speed',
            value: window.p5.randomGaussian(
              window.preyConfig.avgSpeed,
              window.preyConfig.stdDevSpeed
            ),
            modificator: (parent1Value: number, parent2Value: number) => {
              const mean = _.mean([parent1Value, parent2Value]);
              const std = stdDev([parent1Value, parent2Value]);
              let val = window.p5.randomGaussian(mean, std);
              if (val < 0) val = 0.5;
              return val;
            }
          }
        ],
        ...window.preyConfig
      })
    );
  }
  for (let i = 0; i < window.predatorConfig.startingNb; i++) {
    window.animals.push(
      new Predator({
        x: window.p5.random(0, window.size),
        y: window.p5.random(0, window.size),
        genes: [
          {
            displayName: 'Vitesse',
            name: 'speed',
            value: window.p5.randomGaussian(
              window.predatorConfig.avgSpeed,
              window.predatorConfig.stdDevSpeed
            ),
            modificator: (parent1Value: number, parent2Value: number) => {
              const mean = _.mean([parent1Value, parent2Value]);
              const std = stdDev([parent1Value, parent2Value]);
              let val = window.p5.randomGaussian(mean, std);
              if (val < 0) val = 0.5;
              return val;
            }
          }
        ],
        ...window.predatorConfig
      })
    );
  }
};

export const initiateGlobalVariables = (p: p5) => {
  const { random, ceil } = p;
  (() => {
    const avgSpeed = ceil(random(50, 1000));
    const stdDevSpeed = ceil((random(5, 20) * avgSpeed) / 100);
    const avgNbOfBabies = ceil(random(1, 25));
    const stdDevNbOfBabies = ceil((random(5, 20) * avgNbOfBabies) / 100);
    const intervalBetweenReproducingPeriods = ceil(random(100, 2000));
    const longevity = ceil(random(2000, 80000));
    const renderDistance = ceil((avgSpeed * random(100, 500)) / 100);
    const startingNb = ceil(random(4, 100));
    window.preyConfig = {
      avgSpeed,
      stdDevSpeed,
      avgNbOfBabies,
      stdDevNbOfBabies,
      intervalBetweenReproducingPeriods,
      renderDistance,
      longevity,
      startingNb
    };
  })();
  (() => {
    const avgSpeed = ceil(random(50, 1000));
    const stdDevSpeed = ceil((random(5, 20) * avgSpeed) / 100);
    const avgNbOfBabies = ceil(random(1, 25));
    const stdDevNbOfBabies = ceil((random(5, 20) * avgNbOfBabies) / 100);
    const intervalBetweenReproducingPeriods = ceil(random(100, 2000));
    const longevity = ceil(random(2000, 80000));
    const renderDistance = ceil((avgSpeed * random(100, 500)) / 100);
    const startingNb = ceil(random(4, 100));
    const nbOfPreysToEat = ceil(random(1, 50));
    const eatingInterval = ceil(random(50, 2500));
    window.predatorConfig = {
      avgSpeed,
      stdDevSpeed,
      avgNbOfBabies,
      stdDevNbOfBabies,
      intervalBetweenReproducingPeriods,
      renderDistance,
      longevity,
      startingNb,
      nbOfPreysToEat,
      eatingInterval
    };
  })();
  window.nbOfPredators = window.predatorConfig.startingNb;
  window.nbOfPreys = window.preyConfig.startingNb;
  window.animals = [];
  window.time = 0;
  window.speed = 5;
  window.size = 12000;
  try {
    window.p5 = p;
  } catch {}
};
