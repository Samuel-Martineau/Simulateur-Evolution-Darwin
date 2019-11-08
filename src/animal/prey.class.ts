import Animal from './animal.class';
import { updateAverageSpeed } from '../helpers';
import p5 from 'p5';
import _ from 'lodash';

export default class Prey extends Animal {
  constructor({ ...args }: any) {
    super({ ...args, specie: 0 });
    this.eatingInterval = window.preyConfig.eatingInterval;
    this.hunger = window.preyConfig.nbOfPlantsToEat;
    this.addEvent({
      name: `Doit avoir mangé ${this.hunger} plante${this.hunger > 1 ? 's' : ''}`,
      time: this.eatingInterval,
      action: (self: Prey) => self.checkHunger()
    });
  }

  update() {
    let v: p5.Vector | undefined;
    const predators = window.animals.filter(
      (f) => f.specie === 1 && this.position.dist(f.position) < this.renderDistance
    );
    if (predators.length > 0) {
      const nearestPredator = predators.sort((f1, f2) => {
        const d1 = this.position.dist(f1.position);
        const d2 = this.position.dist(f2.position);
        return d1 - d2;
      })[0];
      v = nearestPredator.position
        .copy()
        .sub(this.position)
        .limit(this.getGene('speed', 0).value)
        .mult(-1);
      this.info('Mouvement de proie');
    } else if (this.hunger > 0) {
      const nearestPlant = window.plants
        .filter((p) => this.position.dist(p.position) < this.renderDistance)
        .sort((p1, p2) => this.position.dist(p1.position) - this.position.dist(p2.position))[0];
      if (nearestPlant) {
        v = nearestPlant.position
          .copy()
          .sub(this.position)
          .limit(this.getGene('speed', 0).value);
        this.info("Mouvement d'alimentation");
        if (this.position.dist(nearestPlant.position) < 18) {
          this.hunger--;
          _.remove(window.plants, ['uid', nearestPlant.uid]);
        }
      }
    } else if (this.canReproduce) {
      const breedingPartner = this.getBreedingPartner();
      if (breedingPartner) {
        v = breedingPartner.position
          .copy()
          .sub(this.position)
          .limit(this.getGene('speed', 0).value);
        const newPosition = this.position.copy().add(v);
        const ps = window.animals.filter(
          (f) => f.specie === 1 && newPosition.dist(f.position) < this.renderDistance
        );
        if (ps.length > 0) v = undefined;
        else this.info('Mouvement de reproduction');
        if (breedingPartner.position.dist(this.position) <= 18) {
          this.canReproduce = false;
          breedingPartner.canReproduce = false;
          const { avgNbOfBabies, stdDevNbOfBabies } = window.preyConfig;
          const nbOfBabies = window.p5.randomGaussian(avgNbOfBabies, stdDevNbOfBabies);
          for (let i = 0; i < nbOfBabies; i++) {
            const prey = new Prey({ parent1: this, parent2: breedingPartner });
            window.animals.push(prey);
            updateAverageSpeed(0, prey.generation);
          }
        }
      }
    }
    if (!v) {
      const { noise, map, createVector } = window.p5;
      const speed = this.getGene('speed', 0).value;
      const { x, y } = this.velocity;
      const xToAdd = map(noise(x, window.time, -this.noiseOffset * 3), 0, 1, -speed, speed);
      const yToAdd = map(noise(y, window.time, this.noiseOffset / 3), 0, 1, -speed, speed);
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
      this.hunger = window.preyConfig.nbOfPlantsToEat;
      this.addEvent({
        name: `Doit avoir mangé ${this.hunger} plante${this.hunger > 1 ? 's' : ''}`,
        time: this.eatingInterval,
        action: (self: Prey) => self.checkHunger()
      });
    } else _.remove(window.animals, ['uid', this.uid]);
  }
}
