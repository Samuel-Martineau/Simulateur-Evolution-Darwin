import Animal from './animal.class';
import Gene from './gene.interface';

export default class Hare extends Animal {
  constructor(x?: number, y?: number, genes?: Gene[], parent1?: Hare, parent2?: Hare) {
    super(x, y, genes, parent1, parent2);
  }
}
