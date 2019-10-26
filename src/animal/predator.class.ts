import Animal from './animal.class';
import { updateAverageSpeed, enableLogger } from '../helpers';
import _ from 'lodash';
import p5 from 'p5';

export default class Predator extends Animal {
  constructor({ ...args }: any) {
    super({ ...args, specie: 1 });
    this.eatingInterval = window.predatorConfig.eatingInterval;
    this.hunger = window.predatorConfig.nbOfPreysToEat;
    this.addEvent({
      name: `Doit avoir mangé ${this.hunger} ${window.preyConfig.name}${
        this.hunger > 1 ? 's' : ''
      }`,
      time: this.eatingInterval,
      action: (self: Predator) => self.checkHunger()
    });
  }

  update() {
    let v: p5.Vector | undefined;
    let preys;
    if (this.hunger > 0) {
      preys = window.animals.filter(
        (a) => a.specie === 0 && this.position.copy().dist(a.position) < this.renderDistance
      );
      const nearestPrey = preys.sort((a1, a2) => {
        const d1 = this.position.dist(a1.position);
        const d2 = this.position.dist(a2.position);
        return d1 - d2;
      })[0];
      if (nearestPrey) {
        v = nearestPrey.position
          .copy()
          .sub(this.position)
          .limit(this.getGene('speed', 0).value);
        this.info('Mouvement de chasse');
        if (this.position.dist(nearestPrey.position) < 18) {
          this.hunger -= 1;
          _.remove(window.animals, ['uid', nearestPrey.uid]);
        }
      }
    } else if (this.canReproduce) {
      const breedingPartner = this.getBreedingPartner();
      if (breedingPartner) {
        v = breedingPartner.position
          .copy()
          .sub(this.position)
          .limit(this.getGene('speed', 0).value);
        this.info('Mouvement de reproduction');
        if (breedingPartner.position.dist(this.position) <= 18) {
          this.canReproduce = false;
          breedingPartner.canReproduce = false;
          const { avgNbOfBabies, stdDevNbOfBabies } = window.predatorConfig;
          const nbOfBabies = window.p5.randomGaussian(avgNbOfBabies, stdDevNbOfBabies);
          for (let i = 0; i < nbOfBabies; i++) {
            const predator = new Predator({ parent1: this, parent2: breedingPartner });
            window.animals.push(predator);
            updateAverageSpeed(1, predator.generation);
          }
        }
      }
    }
    if (!v) {
      const { noise, map, createVector } = window.p5;
      const speed = this.getGene('speed', 0).value;
      const { x, y } = this.velocity;
      const xToAdd = map(noise(x, window.time, this.customData.noiseOffset), 0, 1, -speed, speed);
      const yToAdd = map(noise(y, window.time, this.customData.noiseOffset), 0, 1, -speed, speed);
      v = this.velocity
        .copy()
        .add(createVector(xToAdd, yToAdd))
        .limit(speed);
      this.info('Mouvement de perlin');
    }
    this.velocity = v;
    super.update();
  }

  checkHunger() {
    if (this.hunger <= 0) {
      this.hunger = window.predatorConfig.nbOfPreysToEat;
      this.addEvent({
        name: `Doit avoir mangé ${this.hunger} ${window.preyConfig.name}${
          this.hunger > 1 ? 's' : ''
        }`,
        time: this.eatingInterval,
        action: (self: Predator) => self.checkHunger()
      });
    } else _.remove(window.animals, ['uid', this.uid]);
  }

  set hunger(newHunger: number) {
    this.customData.hunger = newHunger;
  }

  get hunger(): number {
    return this.customData.hunger;
  }

  set eatingInterval(newInterval: number) {
    this.customData.eatingInterval = newInterval;
  }

  get eatingInterval() {
    return this.customData.eatingInterval;
  }
}