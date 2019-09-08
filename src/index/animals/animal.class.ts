import { Gene } from './gene.interface';
import * as _ from 'lodash';
import { stdDev } from '../helpers';
import { Event } from './event.interface';

export class Animal {
  public x: number;
  public y: number;
  public genes: Gene[] = [];
  public events: Event[] = [];
  public canReproduce: boolean = false;

  constructor(x?: number, y?: number, genes?: Gene[], parent1?: Animal, parent2?: Animal) {
    if (x && y && genes && !parent1 && !parent2) {
      this.x = x;
      this.y = y;
      this.genes = genes;
    } else if (
      !x &&
      !y &&
      !genes &&
      parent1 &&
      parent2 &&
      parent1.constructor === parent2.constructor
    ) {
      const parents = [parent1, parent2];
      this.x = _.meanBy(parents, 'x');
      this.y = _.meanBy(parents, 'y');
      for (let i = 0; i < parent1.genes.length; i++) {
        let name = parent1.genes[i].name;
        const parentGenes = [parent1.genes, parent2.genes];
        const mean = _.meanBy(parentGenes, 'value');
        const sd = stdDev(parentGenes, 'value');
        let value = window.processing.randomGaussian(mean, sd);
        let gene: Gene = {
          name,
          value
        };
        this.genes[i] = gene;
      }
    } else {
      throw new Error('Wrong args for the Animal constructor');
    }
  }

  display() {}

  update() {
    _.filter(this.events, ['time', window.time]).forEach((event) => {
      event.action(this);
      _.remove(this.events, (el) => _.isMatch(el, event));
    });
  }

  addEvent(event: Event) {
    this.events.push(event);
  }
}