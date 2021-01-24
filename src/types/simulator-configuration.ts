export type PlantSpecie = "plant";
export type AnimalSpecie = "prey" | "predator";
export type Specie = AnimalSpecie | PlantSpecie;

export type AnimalGene =
  | "speed"
  | "numberOfBabies"
  | "intervalBetweenReproductionPeriods"
  | "viewDistance"
  | "longevity"
  | "amountOfFoodToEat"
  | "timeToEat";

export interface GeneConfiguration<T extends AnimalGene> {
  modificator: "constant" | "evolutionary";
  value: number;
  average: number;
  standardDeviation: number;
  adjustments: {
    [key in Exclude<AnimalGene, T>]: number;
  };
}

export interface AnimalSpecieConfiguration {
  exists: boolean;
  startingNumber: number;
  genes: {
    [K in AnimalGene]: GeneConfiguration<K>;
  };
}

export interface PlantSpecieConfiguration {
  exists: boolean;
  startingNumber: number;
  spawnAmount: number;
  spawnInterval: number;
}

export interface SimulatorConfiguration {
  version: "2";

  id: string;
  title: string;

  seed: number;
  mapSideSize: number;

  species: {
    [K in Specie]: K extends AnimalSpecie
      ? AnimalSpecieConfiguration
      : K extends PlantSpecie
      ? PlantSpecieConfiguration
      : never;
  };
}
