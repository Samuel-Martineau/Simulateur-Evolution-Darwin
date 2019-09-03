import { Animal } from './animal.class';
import { Gene } from './gene.interface';
import p5 from 'p5';

export class Rabbit extends Animal {
  constructor(x?: number, y?: number, genes?: Gene[], parent1?: Rabbit, parent2?: Rabbit) {
    super(x, y, genes, parent1, parent2);
    this.specie = 'rabbit';
  }
}
