import Animal from './animal.class';
import { ChildParams, DefaultParams } from './animalParams.interfaces';
import { updateAverageSpeed } from '../helpers';
import _ from 'lodash';

export default class Fox extends Animal {
  constructor({ ...args }: DefaultParams | ChildParams) {
    super({ ...args, specie: 1 });
    this.customData.hunger = 1;
    this.addEvent({
      name: `Doit avoir mangé ${this.customData.hunger} lapin${
        this.customData.hunger > 1 ? 's' : ''
      }`,
      time: this.intervalBetweenEatingPeriods,
      action: this.checkHunger.bind(this)
    });
  }

  update() {
    if (this.canReproduce) {
      const breedingPartner = this.getBreedingPartner();
      if (breedingPartner) {
        this.canReproduce = false;
        breedingPartner.canReproduce = false;
        const fox = new Fox({ parent1: this, parent2: breedingPartner });
        window.animals.push(fox);
        updateAverageSpeed(1, fox.generation);
      }
    }
    super.update();
  }

  checkHunger() {
    if (this.customData.hunger === 0) {
      this.customData.hunger = 1;
      this.addEvent({
        name: `Doit avoir mangé ${this.customData.hunger} lapin${
          this.customData.hunger > 1 ? 's' : ''
        }`,
        time: this.intervalBetweenEatingPeriods,
        action: () => this.checkHunger
      });
    } else _.remove(window.animals, ['uid', this.uid]);
  }
}
