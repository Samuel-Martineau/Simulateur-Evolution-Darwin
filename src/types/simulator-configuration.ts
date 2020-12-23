export type AnimalSpecie = 'prey' | 'predator';
export type Specie = AnimalSpecie | 'plant';

export interface GeneConfiguration {
  modificator: 'constant' | 'evolutionary';
  value: number;
  average: number;
  standardDeviation: number;
}

export interface AnimalSpecieConfiguration {
  exists: boolean;
  startingNumber: number;
  genes: {
    speed: GeneConfiguration;
    numberOfBabies: GeneConfiguration;
    intervalBetweenReproductionPeriods: GeneConfiguration;
    viewDistance: GeneConfiguration;
    longevity: GeneConfiguration;
    amountOfFoodToEat: GeneConfiguration;
    timeToEat: GeneConfiguration;
  };
}

export interface SimulatorConfiguration {
  id: string;
  title: string;

  seed: string;
  mapSideSize: number;

  species: {
    prey: AnimalSpecieConfiguration;
    predator: AnimalSpecieConfiguration;
    plant: {
      exists: boolean;
      startingNumber: number;
      spawnRate: number;
      spawnInterval: number;
    };
  };
}
