import Animal from './animal.class';
import { updateAverageGenes } from '../helpers';
import p5 from 'p5';
import _ from 'lodash';

export default class Prey extends Animal {
  constructor({ ...args }: any) {
    super({ ...args, specie: 0 });
    this.hunger = 0;
    this.checkHunger('plante');
  }

  update() {
    let v: p5.Vector | undefined;
    const predators = window.animals.filter(
      f => f.specie === 1 && this.position.dist(f.position) < this.renderDistance
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
    } else if (this.hunger > 0) {
      const nearestPlant = window.plants
        .filter(p => this.position.dist(p.position) < this.renderDistance)
        .sort((p1, p2) => this.position.dist(p1.position) - this.position.dist(p2.position))[0];
      if (nearestPlant) {
        v = nearestPlant.position
          .copy()
          .sub(this.position)
          .limit(this.getGene('speed', 0).value);
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
        const ps = window.animals.filter(f => f.specie === 1 && newPosition.dist(f.position) < this.renderDistance);
        if (ps.length > 0) v = undefined;
        if (breedingPartner.position.dist(this.position) <= 18) {
          this.canReproduce = false;
          breedingPartner.canReproduce = false;
          const nbOfBabies = this.getRealGeneValue('nbOfBabies', 0);
          for (let i = 0; i < nbOfBabies; i++) {
            const prey = new Prey({ parent1: this, parent2: breedingPartner });
            window.animals.push(prey);
            updateAverageGenes(0, prey.generation);
          }
        }
      }
    }
    if (!v) v = this.noiseMovement();
    this.velocity = v;
    super.update();
  }
}
