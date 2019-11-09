import * as _ from 'lodash';
import Plant from './plant.class';

export const stdDev = (arr: any[], key?: string) => {
  if (key) arr = arr.map((val) => val[key]);
  let avg = _.mean(arr);
  return _.chain(arr)
    .map((val) => Math.abs(val - avg))
    .mean()
    .value();
};

export const createPlant = () => {
  const { random } = window.p5;
  const { size } = window;
  window.plants.push(new Plant(random(size), random(size)));
};
