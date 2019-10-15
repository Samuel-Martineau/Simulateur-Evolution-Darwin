import Animal from './animal.class';
import { ChildParams, DefaultParams } from './animalParams.interfaces';
import { updateAverageSpeed, enableLogger } from '../helpers';
import _ from 'lodash';
import p5 from 'p5';

export default class Fox extends Animal {
  constructor({ ...args }: DefaultParams | ChildParams) {
    super({ ...args, specie: 1 });
    this.hunger = 1;
    this.addEvent({
      name: `Doit avoir mangé ${this.hunger} lapin${this.hunger > 1 ? 's' : ''}`,
      time: this.intervalBetweenEatingPeriods,
      action: (self: Fox) => self.checkHunger()
    });
  }

  update() {
    let v: p5.Vector | undefined;
    let hares;
    if (this.customData.hunger > 0) {
      hares = window.animals.filter(
        (a) => a.specie === 0 && this.position.copy().dist(a.position) < this.renderDistance
      );
      const nearestHare = hares.sort((a1, a2) => {
        const d1 = this.position.dist(a1.position);
        const d2 = this.position.dist(a2.position);
        return d1 - d2;
      })[0];
      if (nearestHare) {
        v = nearestHare.position
          .copy()
          .sub(this.position)
          .limit(this.getGene('speed', 0).value);
        this.info('Mouvement de chasse');
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
          const fox = new Fox({ parent1: this, parent2: breedingPartner });
          window.animals.push(fox);
          updateAverageSpeed(1, fox.generation);
        }
      }
    }
    if (!v) {
      const { noise, map, createVector } = window.p5;
      const speed = this.getGene('speed', 0).value;
      const { x, y } = this.velocity;
      const xToAdd = map(noise(x, window.time, this.customData.noiseOffset), 0, 1, -speed, speed);
      const yToAdd = map(noise(y, window.time, this.customData.noiseOffset), 0, 1, -speed, speed);
      v = this.velocity.add(createVector(xToAdd, yToAdd)).limit(speed);
      this.info('Mouvement de perlin');
    }
    this.velocity = v;
    super.update();
    if (!hares)
      hares = window.animals.filter(
        (a) => a.specie === 0 && this.position.copy().dist(a.position) < this.renderDistance
      );
    const nearestHare = hares.sort((a1, a2) => {
      const d1 = this.position.dist(a1.position);
      const d2 = this.position.dist(a2.position);
      return d1 - d2;
    })[0];
    if (nearestHare && nearestHare.position.dist(this.position) < 18) {
      this.hunger -= 1;
      _.remove(window.animals, ['uid', nearestHare.uid]);
    }
  }

  checkHunger() {
    if (this.hunger <= 0) {
      this.hunger = 1;
      this.addEvent({
        name: `Doit avoir mangé ${this.hunger} lapin${this.customData.hunger > 1 ? 's' : ''}`,
        time: this.intervalBetweenEatingPeriods,
        action: () => this.checkHunger
      });
    } else _.remove(window.animals, ['uid', this.uid]);
  }

  set hunger(newHunger: number) {
    this.customData.hunger = newHunger;
  }

  get hunger(): number {
    return this.customData.hunger;
  }
}
