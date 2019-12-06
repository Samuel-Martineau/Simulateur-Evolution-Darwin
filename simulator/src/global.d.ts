interface Window {
  p5: import('p5');
  imgs: import('p5').Image[];
  animals: import('./animal/animal.class').default[];
  plants: import('./plant.class').default[];
  size: number;
  speed: number;
  time: number;
  averagePreyGenes: number[];
  averagePredatorGenes: number[];
  scale: number;
  offsetX: number;
  offsetY: number;
  isPopupActive: boolean;
  enabledLoggers: string[];
  preyConfig: any;
  predatorConfig: any;
  plantConfig: any;
  nbOfAnimalsSnapshotInterval: number;
  nbOfPlantsByTime: number[];
  nbOfPreysByTime: number[];
  nbOfPredatorsByTime: number[];

  exportToCSV(): void;
  showAverageGenesChart(): void;
  showChangeSpeedDialog(): void;
  showChangeScaleDialog(): void;
  showNbOfAnimalsByTime(): void;
  showStatsOfAnimal(animal: import('./animal/animal.class').default): void;
  enableLogger(name: string): void;
  disableLogger(name: string): void;
  showSpawn(): void;
  showKill(): void;

  started: boolean;
  config: any;
  start(): void;
  end(): void;
}
