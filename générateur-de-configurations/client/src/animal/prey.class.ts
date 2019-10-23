import Animal from './animal.class';
import p5 from 'p5';

export default class Prey extends Animal {
  constructor({ ...args }: any) {
    super({ ...args, specie: 0 });
    this.customData.noiseOffset = window.p5.random(-300, 300);
  }

  update() {
    let v: p5.Vector | undefined;
    let predators;
    if (this.canReproduce) {
      const breedingPartner = this.getBreedingPartner();
      if (breedingPartner) {
        v = breedingPartner.position
          .copy()
          .sub(this.position)
          .limit(this.getGene('speed', 0).value);
        predators = window.animals.filter(
          (f) => f.specie === 1 && this.position.dist(f.position) < this.renderDistance
        );
        const newPosition = this.position.copy().add(v);
        const nearestPredator = predators.sort((f1, f2) => {
          const d1 = newPosition.dist(f1.position);
          const d2 = newPosition.dist(f2.position);
          return d1 - d2;
        })[0];
        if (nearestPredator && nearestPredator.position.dist(newPosition) < this.renderDistance)
          v = undefined;
        if (breedingPartner.position.dist(this.position) <= 18) {
          this.canReproduce = false;
          breedingPartner.canReproduce = false;
          const { avgNbOfBabies, stdDevNbOfBabies } = window.preyConfig;
          const nbOfBabies = window.p5.randomGaussian(avgNbOfBabies, stdDevNbOfBabies);
          for (let i = 0; i < nbOfBabies; i++) {
            const prey = new Prey({ parent1: this, parent2: breedingPartner });
            window.animals.push(prey);
          }
        }
      }
    }
    if (!v) {
      if (!predators)
        predators = window.animals.filter(
          (f) => f.specie === 1 && this.position.copy().dist(f.position) < this.renderDistance
        );
      const nearestPredator = predators.sort((f1, f2) => {
        const d1 = this.position.dist(f1.position);
        const d2 = this.position.dist(f2.position);
        return d1 - d2;
      })[0];
      if (nearestPredator) {
        v = nearestPredator.position
          .copy()
          .sub(this.position)
          .limit(this.getGene('speed', 0).value)
          .mult(-1);
      } else {
        const { noise, map, createVector } = window.p5;
        const speed = this.getGene('speed', 0).value;
        const { x, y } = this.velocity;
        const xToAdd = map(noise(x, window.time, this.customData.noiseOffset), 0, 1, -speed, speed);
        const yToAdd = map(noise(y, window.time, this.customData.noiseOffset), 0, 1, -speed, speed);
        v = this.velocity
          .copy()
          .add(createVector(xToAdd, yToAdd))
          .limit(speed);
      }
    }
    this.velocity = v;
    super.update();
  }
}
