import Animal from './animal.class';
import { ChildParams, DefaultParams } from './animalParams.interfaces';
import { updateAverageSpeed } from '../helpers';
import Fox from './fox.class';
import p5 from 'p5';

export default class Hare extends Animal {
  constructor({ ...args }: DefaultParams | ChildParams) {
    super({ ...args, specie: 0 });
  }

  update() {
    let v: p5.Vector;
    if (this.canReproduce) {
      const hares = <Fox[]>window.animals.filter((h) => {
        return (
          h.specie === 0 &&
          h.canReproduce &&
          h.uid !== this.uid &&
          this.position.copy().dist(h.position) < this.renderDistance
        );
      });
      const nearestHare = hares.sort((f1, f2) => {
        const d1 = this.position.dist(f1.position);
        const d2 = this.position.dist(f2.position);
        return d1 - d2;
      })[0];
      if (nearestHare) {
        v = nearestHare.position
          .copy()
          .sub(this.position)
          .limit(this.getGene('speed', 0).value);
        const foxes = <Fox[]>window.animals.filter((f) => f.specie === 1);
        if (
          foxes.some(
            (fox) =>
              Math.abs(
                this.position
                  .copy()
                  .add(v)
                  .dist(fox.position)
              ) < fox.getGene('speed', 0).value
          )
        ) {
          //@ts-ignore
          v = undefined;
        }
      }
      const breedingPartner = this.getBreedingPartner();
      if (breedingPartner) {
        this.canReproduce = false;
        breedingPartner.canReproduce = false;
        const hare = new Hare({ parent1: this, parent2: breedingPartner });
        window.animals.push(hare);
        updateAverageSpeed(0, hare.generation);
      }
    }
    //@ts-ignore
    if (!v) {
      const foxes = <Fox[]>window.animals.filter((f) => {
        return f.specie === 1 && this.position.copy().dist(f.position) < this.renderDistance;
      });
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
        const { map, noise, createVector } = window.p5;
        const { x, y } = this.position;
        const speed = this.getGene('speed', 0).value;
        v = createVector(
          map(noise(x, window.time), 0, 1, 0, speed),
          map(noise(y, window.time), 0, 1, 0, speed)
        );
      }
    }
    this.position.add(v);
    super.update();
  }
}
