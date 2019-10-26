interface Window {
  p5: import('p5');
  imgs: import('p5').Image[];
  animals: import('./animal/animal.class').default[];
  size: number;
  speed: number;
  time: number;
  averagePreySpeed: number[];
  averagePredatorSpeed: number[];
  scale: number;
  offsetX: number;
  offsetY: number;
  isPopupActive: boolean;
  enabledLoggers: string[];
  preyConfig: any;
  predatorConfig: any;
  ue: number;
  ueUnit: string;
  ut: number;
  utUnit: string;

  exportToCSV(): void;
  showAverageSpeedChart(): void;
  showChangeSpeedDialog(): void;
  showChangeScaleDialog(): void;
  showSpeedCurve(): void;
  showStatsOfAnimal(animal: import('./animal/animal.class').default): void;
  enableLogger(name: string): void;
  disableLogger(name: string): void;
}
