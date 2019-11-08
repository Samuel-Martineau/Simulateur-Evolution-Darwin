interface Window {
  p5: import('p5');
  animals: import('./animal/animal.class').default[];
  size: number;
  speed: number;
  time: number;
  averagePreySpeed: number[];
  averagePredatorSpeed: number[];
  enabledLoggers: string[];
  preyConfig: any;
  predatorConfig: any;
}
