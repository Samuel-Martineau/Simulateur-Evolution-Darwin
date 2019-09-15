import Gene from './gene.interface';
import Animal from './animal.class';

export interface DefaultParams {
  x: number;
  y: number;
  genes: Gene[];
  specie?: number;
}
export interface ChildParams {
  parent1: Animal;
  parent2: Animal;
}
