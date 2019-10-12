import Animal from './animal.class';
import { ChildParams, DefaultParams } from './animalParams.interfaces';
import { updateAverageSpeed } from '../helpers';
import Fox from './fox.class';
import p5 from 'p5';

export default class Hare extends Animal {
  constructor({ ...args }: DefaultParams | ChildParams) {
    super({ ...args, specie: 0 });
    this.customData.noiseOffset = Math.random();
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
        foxes = <Fox[]>(
          window.animals.filter(
            (f) => f.specie === 1 && this.position.dist(f.position) < this.renderDistance
          )
        );
        if (this.canBeReachedByFox(this.position.copy().add(v), foxes)) v = undefined;
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
        foxes = <Fox[]>(
          window.animals.filter(
            (f) => f.specie === 1 && this.position.copy().dist(f.position) < this.renderDistance
          )
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
      } else {
        const { noise, map, createVector } = window.p5;
        const speed = this.getGene('speed', 0).value;
        const { x, y } = this.velocity;
        const xToAdd = map(noise(x, window.time), 0, 1, -speed, speed);
        const yToAdd = map(noise(y, window.time), 0, 1, -speed, speed);
        v = this.velocity.add(createVector(xToAdd, yToAdd)).limit(speed);
        console.log(v);
      }
    }
    //@ts-ignore
    this.velocity = v;
    super.update();
  }

  canBeReachedByFox(position = this.position.copy(), foxes: Fox[]): boolean {
    return foxes.some(
      (fox) => Math.abs(position.dist(fox.position)) < fox.getGene('speed', 0).value
    );
  }
}
