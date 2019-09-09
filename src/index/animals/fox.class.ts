import Animal from './animal.class';
import Gene from './gene.interface';

export default class Fox extends Animal {
  constructor(x?: number, y?: number, genes?: Gene[], parent1?: Fox, parent2?: Fox) {
    super(x, y, genes, parent1, parent2);
  }
}
