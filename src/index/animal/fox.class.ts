import Animal from './animal.class';
import { ChildParams, DefaultParams } from './animalParams.interfaces';
import { updateAverageSpeed } from '../helpers';

export default class Fox extends Animal {
  constructor({ ...args }: DefaultParams | ChildParams) {
    super({ ...args, specie: 2 });
  }

  update() {
    // this.position.add(0.1 * this.getGene('speed', 1).value, 0.1 * this.getGene('speed', 1).value);
    if (this.position.x > window.size) this.position.x = 0;
    if (this.position.x < 0) this.position.x = window.size;
    if (this.position.y > window.size) this.position.y = 0;
    if (this.position.y < 0) this.position.y = window.size;

    if (this.canReproduce) {
      const breedingPartner = this.getBreedingPartner();
      if (breedingPartner) {
        this.canReproduce = false;
        breedingPartner.canReproduce = false;
        const fox = new Fox({ parent1: this, parent2: breedingPartner });
        window.animals.push(fox);
        updateAverageSpeed(2, fox.generation);
      }
    }
    super.update();
  }
}
