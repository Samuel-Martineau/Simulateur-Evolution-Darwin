import { Animal } from './animal.class';
import p5 from 'p5';
import { Gene } from './gene.interface';
import { Rabbit } from './rabbit.class';

export class Fox extends Animal {
  constructor(x?: number, y?: number, genes?: Gene[], parent1?: Fox, parent2?: Fox) {
    super(x, y, genes, parent1, parent2);
    this.specie = 'fox';
  }
}
