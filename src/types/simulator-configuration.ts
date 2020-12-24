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

export interface PlantSpecieConfiguration {
  exists: boolean;
  startingNumber: number;
  spawnAmount: number;
  spawnInterval: number;
}

export interface SimulatorConfiguration {
  version: '2';

  id: string;
  title: string;

  seed: number;
  mapSideSize: number;

  species: {
    plant: PlantSpecieConfiguration;
    prey: AnimalSpecieConfiguration;
    predator: AnimalSpecieConfiguration;
  };
}
