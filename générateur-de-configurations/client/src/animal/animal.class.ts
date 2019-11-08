import Gene from './gene.interface';
import * as _ from 'lodash';
import Event from './event.interface';
import p5 from 'p5';
import UIDGenerator from 'uid-generator';
//@ts-ignore
const uidgen = new UIDGenerator();

export default class Animal {
  private properties: any;
  public customData: any;

  constructor({ ...args }: any) {
    this.customData = {};
    //@ts-ignore
    const {
      x,
      y,
      genes,
      intervalBetweenReproducingPeriods,
      renderDistance,
      longevity,
      specie,
      parent1,
      parent2
    } = args;
    this.properties = {
      genes: genes || [],
      canReproduce: false,
      intervalBetweenReproducingPeriods,
      longevity,
      specie,
      uid: uidgen.generateSync(),
      generation: 1,
      renderDistance
    };
    this.customData.position = window.p5.createVector(x || 0, y || 0);
    this.customData.velocity = window.p5.createVector(0, 0);
    this.customData.events = [];
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
    if (
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
      this.customData.position = window.p5.createVector(x, y);
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
    }
  }

  get canReproduce(): boolean {
    return this.customData.canReproduce;
  }

  set canReproduce(canReproduce: boolean) {
    if (canReproduce) {
      this.customData.canReproduce = true;
    } else {
      this.customData.canReproduce = false;
      this.addEvent({
        name: 'Peut se reproduire',
        time: window.time + this.intervalBetweenReproducingPeriods,
        action: () => (this.canReproduce = true)
      });
    }
  }

  get events(): Event[] {
    return this.customData.events;
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
    return this.customData.position;
  }

  set position(newValue: p5.Vector) {
    this.customData.position = newValue;
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

  set velocity(newV: p5.Vector) {
    this.customData.velocity = newV;
  }

  get velocity(): p5.Vector {
    return this.customData.velocity;
  }

  getBreedingPartner(): Animal {
    return _.filter(
      window.animals,
      (animal) =>
        animal.specie === this.specie &&
        animal.canReproduce &&
        animal.uid !== this.uid &&
        animal.position.dist(this.position) < this.renderDistance
    ).sort((a1, a2) => {
      const d1 = this.position.dist(a1.position);
      const d2 = this.position.dist(a2.position);
      return d1 - d2;
    })[0];
  }

  update() {
    this.position.add(this.velocity);
    while (this.position.x > window.size) this.position.x -= window.size;
    while (this.position.x < 0) this.position.x += window.size;
    while (this.position.y > window.size) this.position.y -= window.size;
    while (this.position.y < 0) this.position.y += window.size;
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

  clone(): Animal {
    return _.cloneDeep(this);
  }
}
