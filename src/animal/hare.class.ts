import Animal from './animal.class';
import { ChildParams, DefaultParams } from './animalParams.interfaces';
import { updateAverageSpeed } from '../helpers';
import Fox from './fox.class';
import p5 from 'p5';

export default class Hare extends Animal {
  constructor({ ...args }: DefaultParams | ChildParams) {
    super({ ...args, specie: 0 });
    this.customData.noiseOffset = window.p5.random(-300, 300);
  }

  update() {
    let v: p5.Vector | undefined;
    let foxes;
    if (this.canReproduce) {
      const breedingPartner = this.getBreedingPartner();
      if (breedingPartner) {
        v = breedingPartner.position
          .copy()
          .sub(this.position)
          .limit(this.getGene('speed', 0).value);
        foxes = window.animals.filter(
          (f) => f.specie === 1 && this.position.dist(f.position) < this.renderDistance
        );
        const newPosition = this.position.copy().add(v);
        const nearestFox = foxes.sort((f1, f2) => {
          const d1 = newPosition.dist(f1.position);
          const d2 = newPosition.dist(f2.position);
          return d1 - d2;
        })[0];
        if (nearestFox && nearestFox.position.dist(newPosition) < this.renderDistance)
          v = undefined;
        else this.info('Mouvement de reproduction');
        if (breedingPartner.position.dist(this.position) <= 18) {
          this.canReproduce = false;
          breedingPartner.canReproduce = false;
          const hare = new Hare({ parent1: this, parent2: breedingPartner });
          window.animals.push(hare);
          updateAverageSpeed(0, hare.generation);
        }
      }
    }
    if (!v) {
      if (!foxes)
        foxes = window.animals.filter(
          (f) => f.specie === 1 && this.position.copy().dist(f.position) < this.renderDistance
        );
      const nearestFox = foxes.sort((f1, f2) => {
        const d1 = this.position.dist(f1.position);
        const d2 = this.position.dist(f2.position);
        return d1 - d2;
      })[0];
      if (nearestFox) {
        v = nearestFox.position
          .copy()
          .sub(this.position)
          .limit(this.getGene('speed', 0).value)
          .mult(-1);
        this.info('Mouvement de proie');
      } else {
        const { noise, map, createVector } = window.p5;
        const speed = this.getGene('speed', 0).value;
        const { x, y } = this.velocity;
        const xToAdd = map(noise(x, window.time, this.customData.noiseOffset), 0, 1, -speed, speed);
        const yToAdd = map(noise(y, window.time, this.customData.noiseOffset), 0, 1, -speed, speed);
        v = this.velocity.add(createVector(xToAdd, yToAdd)).limit(speed);
        this.info('Mouvement de perlin');
      }
    }
    this.velocity = v;
    super.update();
  }
}
