import Gene from './gene.interface';
import * as _ from 'lodash';
import Event from './event.interface';
import p5 from 'p5';
import UIDGenerator from 'uid-generator';
import { ChildParams, DefaultParams } from './animalParams.interfaces';
import { getCanvasSize } from '../helpers';
//@ts-ignore
const uidgen = new UIDGenerator();

export default class Animal {
  private properties: any;
  public customData: any;

  constructor({ ...args }: DefaultParams | ChildParams) {
    this.customData = {};
    //@ts-ignore
    const { x, y, genes, specie, parent1, parent2 } = args;
    this.properties = {
      position: window.p5.createVector(0, 0),
      genes: [],
      events: [],
      canReproduce: false,
      intervalBetweenReproducingPeriods: 200,
      longevity: 3000,
      specie: -1,
      uid: uidgen.generateSync(),
      generation: 1,
      renderDistance: 200
    };
    if (specie === 2) this.properties.intervalBetweenEatingPeriods = 175;
    this.addEvent({
      name: 'Peut se reproduire',
      time: this.properties.intervalBetweenReproducingPeriods,
      action: (self) => (self.canReproduce = true)
    });
    this.addEvent({
      name: 'Mort',
      time: this.properties.longevity,
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
      this.properties.specie = parent1.specie;
      this.properties.generation = _.maxBy(parents, (p) => p.generation).generation + 1;
      for (let i = 0; i < parent1.genes.length; i++) {
        let name = parent1.genes[i].name;
        this.properties.genes[i] = {
          name,
          displayName: parent1.getGene(name, 0).displayName,
          value: parent1.genes[i].modificator(
            parent1.getGene(name, 0).value,
            parent2.getGene(name, 0).value
          ),
          modificator: parent1.properties.genes[i].modificator
        };
      }
    } else {
      throw new Error('Wrong args for the Animal constructor');
    }
  }

  get canReproduce(): boolean {
    return this.properties.canReproduce;
  }

  set canReproduce(canReproduce: boolean) {
    if (canReproduce) {
      this.properties.canReproduce = true;
    } else {
      this.properties.canReproduce = false;
      this.addEvent({
        name: 'Peut se reproduire',
        time: window.time + this.intervalBetweenReproducingPeriods,
        action: () => (this.canReproduce = true)
      });
    }
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

  get renderDistance(): number {
    return this.properties.renderDistance;
  }

  get generation(): number {
    return this.properties.generation;
  }

  get intervalBetweenEatingPeriods(): number {
    return this.properties.intervalBetweenEatingPeriods;
  }

  display() {
    const { x, y } = this.position;
    window.p5.image(window.imgs[this.specie], x - window.offsetX, y - window.offsetY);
  }

  update() {
    while (this.position.x > window.size) this.position.x -= window.size;
    while (this.position.x < 0) this.position.x += window.size;
    while (this.position.y > window.size) this.position.y -= window.size;
    while (this.position.y < 0) this.position.y += window.size;
    // Système d'évènements
    _.filter(this.events, (e) => e.time <= window.time).forEach((event) => {
      event.action(this);
      _.remove(this.events, (el) => _.isMatch(el, event));
    });
  }

  addEvent(event: Event) {
    event.time += window.time;
    this.events.push(event);
  }

  getGene(name: string, defValue: any): Gene {
    return _.filter(this.genes, ['name', name])[0] || { displayName: name, name, value: defValue };
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

  isClicked(mx: number, my: number) {
    const proportion = (getCanvasSize() / window.size) * window.scale;
    const clicked =
      mx / proportion > this.position.x + window.offsetX - 9 &&
      mx / proportion < this.position.x + window.offsetX + 9 &&
      my / proportion > this.position.y + window.offsetY - 9 &&
      my / proportion < this.position.y + window.offsetY + 9;
    return clicked;
  }

  clone(): Animal {
    return _.cloneDeep(this);
  }
}
