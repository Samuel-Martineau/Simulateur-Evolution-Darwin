import Animal from './animal.class';
import { updateAverageGenes } from '../helpers';
import _ from 'lodash';
import p5 from 'p5';

export default class Predator extends Animal {
  constructor({ ...args }: any) {
    super({ ...args, specie: 1 });
    this.hunger = 0;
    this.checkHunger(window.preyConfig.name);
  }

  update() {
    let v: p5.Vector | undefined;
    let preys;
    if (this.hunger > 0) {
      preys = window.animals.filter(a => a.specie === 0 && this.position.dist(a.position) < this.renderDistance);
      const nearestPrey = preys.sort((a1, a2) => this.position.dist(a1.position) - this.position.dist(a2.position))[0];
      if (nearestPrey) {
        v = nearestPrey.position
          .copy()
          .sub(this.position)
          .limit(this.getGene('speed', 0).value);
        this.info('Mouvement de chasse');
        if (this.position.dist(nearestPrey.position) < 18) {
          this.hunger--;
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
          const nbOfBabies = this.getRealGeneValue('nbOfBabies', 0);
          for (let i = 0; i < nbOfBabies; i++) {
            const predator = new Predator({ parent1: this, parent2: breedingPartner });
            window.animals.push(predator);
            updateAverageGenes(1, predator.generation);
          }
        }
      }
    }
    if (!v) if (!v) v = this.noiseMovement();
    this.velocity = v;
    super.update();
  }
}
