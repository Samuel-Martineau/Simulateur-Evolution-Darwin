import Gene from './gene.interface';
import * as _ from 'lodash';
import Event from './event.interface';
import p5 from 'p5';
import UIDGenerator from 'uid-generator';
import { getCanvasSize, stdDev } from '../helpers';
import Logger from '../logger.class';
//@ts-ignore
const uidgen = new UIDGenerator();

export default class Animal {
  private properties: any;
  public customData: any;
  public info: (name: string) => void;
  public warning: (name: string) => void;
  public error: (name: string) => void;
  public success: (name: string) => void;

  constructor({ ...args }: any) {
    this.customData = {};
    //@ts-ignore
    const { x, y, genes, specie, parent1, parent2 } = args;
    this.properties = {
      position: window.p5.createVector(x || 0, y || 0),
      velocity: window.p5.createVector(0, 0),
      genes: genes || [],
      events: [],
      canReproduce: false,
      specie,
      uid: uidgen.generateSync(),
      generation: 1,
      noiseOffset: window.p5.random(-300, 300)
    };
    this.info = Logger('info', this.uid);
    this.warning = Logger('info', this.uid);
    this.error = Logger('info', this.uid);
    this.success = Logger('info', this.uid);
    if (!x && !y && !genes && parent1 && parent2 && parent1.properties.specie === parent2.properties.specie) {
      const parents: Animal[] = [parent1, parent2];
      let x = _.meanBy(parents, p => p.position.x);
      let y = _.meanBy(parents, p => p.position.y);
      this.properties.position = window.p5.createVector(x, y);
      this.properties.specie = parent1.specie;
      this.properties.intervalBetweenReproducingPeriods = (<Animal>parent1).intervalBetweenReproducingPeriods;
      this.properties.longevity = (<Animal>parent1).longevity;
      this.properties.renderDistance = (<Animal>parent1).renderDistance;
      //@ts-ignore
      this.properties.generation = _.maxBy(parents, p => p.generation).generation + 1;
      for (let i = 0; i < parent1.genes.length; i++) {
        const name = parent1.genes[i].name;
        const displayName = parent1.getGene(name, 0).displayName;
        const modificator: Gene['modificator'] = parent1.genes[i].modificator;
        const displayValue = parent1.genes[i].displayValue;
        let value = 0;
        switch (modificator) {
          case 'constant':
            value = parent1.genes[i].value;
            break;
          case 'average':
            value = _.meanBy(parents, p => p.genes[i].value);
            break;
          case 'stddev':
            const mean = _.meanBy(parents, p => p.genes[i].value);
            const stddev = stdDev(parents, p => p.genes[i].value);
            value = window.p5.randomGaussian(mean, stddev);
            if (value < 0) value = 0;
            break;
        }
        this.properties.genes[i] = {
          name,
          displayName,
          value,
          modificator,
          displayValue
        };
      }
      this.info('Création à partir de parents');
    } else {
      this.customData.longevityOffset = window.p5.random(-this.longevity, 0);
      this.customData.reproducingOffset = window.p5.random(-this.intervalBetweenReproducingPeriods, 0);
    }
    this.addEvent({
      name: 'Peut se reproduire',
      time: this.intervalBetweenReproducingPeriods + (this.customData.reproducingOffset || 0),
      action: self => (self.canReproduce = true)
    });
    this.addEvent({
      name: 'Mort',
      time: this.longevity + (this.customData.longevityOffset || 0),
      action: self => _.remove(window.animals, ['uid', self.uid])
    });
    for (let key in this.properties) {
      if (this.properties[key] === (undefined || null))
        this.error('Les arguments donnés ne correspondent pas à ceux requis');
    }
  }

  get canReproduce(): boolean {
    return this.properties.canReproduce;
  }

  set canReproduce(canReproduce: boolean) {
    if (canReproduce) {
      this.properties.canReproduce = true;
      this.info('Peut se reproduire');
    } else {
      this.properties.canReproduce = false;
      this.addEvent({
        name: 'Peut se reproduire',
        time: window.time + this.intervalBetweenReproducingPeriods,
        action: () => (this.canReproduce = true)
      });
      this.info('Ne peut pas se reproduire');
    }
  }

  get events(): Event[] {
    return this.properties.events;
  }

  get intervalBetweenReproducingPeriods(): number {
    return this.getGene('intervalBetweenReproducingPeriods', 0).value;
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
    this.info('La position a été mise à jour');
  }

  get longevity(): number {
    return this.getGene('longevity', 0).value;
  }

  get uid(): string {
    return this.properties.uid;
  }

  get renderDistance(): number {
    return this.getGene('renderDistance', 0).value;
  }

  get generation(): number {
    return this.properties.generation;
  }

  set velocity(newV: p5.Vector) {
    this.properties.velocity = newV;
    // this.info('La vélocité à été mise à jour');
  }

  get velocity(): p5.Vector {
    return this.properties.velocity;
  }

  get noiseOffset(): number {
    return this.properties.noiseOffset;
  }

  set eatingInterval(newInterval: number) {
    this.properties.eatingInterval = newInterval;
  }

  get eatingInterval() {
    return this.properties.eatingInterval;
  }

  set hunger(newHunger: number) {
    this.customData.hunger = newHunger;
  }

  get hunger(): number {
    return this.customData.hunger;
  }

  getBreedingPartner(): Animal {
    return _.filter(
      window.animals,
      animal =>
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

  display() {
    const { x, y } = this.position;
    window.p5.image(window.imgs[this.specie], x - window.offsetX, y - window.offsetY);
    // this.info('Affichage');
  }

  update() {
    this.position.add(this.velocity);
    while (this.position.x > window.size) this.position.x -= window.size;
    while (this.position.x < 0) this.position.x += window.size;
    while (this.position.y > window.size) this.position.y -= window.size;
    while (this.position.y < 0) this.position.y += window.size;
    // Système d'évènements
    _.filter(this.events, e => e.time <= window.time).forEach(event => {
      event.action(this);
      _.remove(this.events, el => _.isMatch(el, event));
    });
    // this.info('Mise à jour');
  }

  addEvent(event: Event) {
    event.time += window.time;
    this.events.push(event);
    this.info('Un nouvel évènement a été ajouté');
  }

  getGene(name: string, defValue: any): Gene {
    return (
      _.filter(this.genes, ['name', name])[0] || {
        displayName: name,
        name,
        value: defValue
      }
    );
  }

  isClicked(mx: number, my: number): boolean {
    const proportion = (getCanvasSize() / window.size) * window.scale;
    const clicked =
      mx / proportion > this.position.x - window.offsetX - 12 &&
      mx / proportion < this.position.x - window.offsetX + 12 &&
      my / proportion > this.position.y - window.offsetY - 12 &&
      my / proportion < this.position.y - window.offsetY + 12;
    return clicked;
  }

  clone(): Animal {
    this.info('Cloné !');
    return _.cloneDeep(this);
  }
}
