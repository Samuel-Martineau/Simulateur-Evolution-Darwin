import Gene from './gene.interface';
import * as _ from 'lodash';
import { stdDev } from '../helpers';
import Event from './event.interface';
import p5 from 'p5';
import UIDGenerator from 'uid-generator';
import { DefaultParams, ChildParams } from './animalParams.interfaces';
//@ts-ignore
const uidgen = new UIDGenerator();

interface AnimalProperties {
  position: p5.Vector;
  genes: Gene[];
  events: Event[];
  canReproduce: boolean;
  intervalBetweenReproducingPeriods: number;
  longevity: number;
  specie: number;
  uid: string;
  generation: 0;
}

export default class Animal {
  private properties: AnimalProperties;
  constructor({ ...args }: DefaultParams | ChildParams) {
    //@ts-ignore
    const { x, y, genes, specie, parent1, parent2 } = args;
    this.properties = {
      position: window.p5.createVector(0, 0),
      genes: [],
      events: [],
      canReproduce: false,
      intervalBetweenReproducingPeriods: 200,
      longevity: 2000,
      specie: -1,
      uid: uidgen.generateSync(),
      generation: 0
    };
    this.addEvent({
      name: 'canReproduce',
      time: window.time + this.properties.intervalBetweenReproducingPeriods,
      action: (self) => (self.canReproduce = true)
    });
    this.addEvent({
      name: 'shouldDie',
      time: window.time + this.properties.longevity,
      action: (self) => _.remove(window.animals, ['uid', self.uid])
    });
    if (x && y && genes && specie !== undefined && !parent1 && !parent2) {
      this.properties.position = window.p5.createVector(x, y);
      this.properties.genes = genes;
      this.properties.specie = specie;
    } else if (
      !x &&
      !y &&
      !genes &&
      parent1 &&
      parent2 &&
      parent1.properties.specie === parent2.properties.specie
    ) {
      const parents = [parent1, parent2];
      let x = _.meanBy(parents, (p: Animal) => p.position.x);
      let y = _.meanBy(parents, (p: Animal) => p.position.y);
      this.properties.position = window.p5.createVector(x, y);
      this.properties.specie = parent1.properties.specie;
      this.properties.generation = _.maxBy(parents, (p) => p.generation).generation + 1;
      for (let i = 0; i < parent1.properties.genes.length; i++) {
        let name = parent1.properties.genes[i].name;
        let gene: Gene = {
          name,
          value: parent1.properties.genes[i].modificator(),
          modificator: parent1.properties.genes[i].modificator
        };
        this.properties.genes[i] = gene;
      }
    } else {
      throw new Error('Wrong args for the Animal constructor');
    }
  }

  display() {
    const { x, y } = this.position;
    window.p5.image(window.imgs[this.specie], x, y);
  }

  update() {
    // Event system
    _.filter(this.events, (e) => e.time <= window.time).forEach((event) => {
      event.action(this);
      _.remove(this.events, (el) => _.isMatch(el, event));
    });
  }

  addEvent(event: Event) {
    this.events.push(event);
  }

  getGene(name: string, defValue: number): Gene {
    return _.filter(this.genes, ['name', name])[0] || { name, value: defValue };
  }

  getBreedingPartner() {
    return _.filter(window.animals, (animal) => {
      return (
        animal.specie === this.specie &&
        animal.uid !== this.uid &&
        animal.canReproduce &&
        Math.abs(
          animal.position
            .copy()
            .sub(this.position)
            .mag()
        ) < 18
      );
    })[0];
  }

  set canReproduce(canReproduce: boolean) {
    if (canReproduce) {
      this.properties.canReproduce = true;
    } else {
      this.properties.canReproduce = false;
      this.addEvent({
        name: 'canReproduce',
        time: window.time + this.intervalBetweenReproducingPeriods,
        action: () => (this.canReproduce = true)
      });
    }
  }

  get canReproduce(): boolean {
    return this.properties.canReproduce;
  }

  get events(): Event[] {
    return this.properties.events;
  }

  get intervalBetweenReproducingPeriods(): number {
    return this.properties.intervalBetweenReproducingPeriods;
  }

  get genes(): Gene[] {
    return this.properties.genes;
  }

  get specie(): number {
    return this.properties.specie;
  }

  get position(): p5.Vector {
    return this.properties.position;
  }

  set position(newValue: p5.Vector) {
    this.properties.position = newValue;
  }

  get uid(): string {
    return this.properties.uid;
  }

  get generation(): number {
    return this.properties.generation;
  }
}
