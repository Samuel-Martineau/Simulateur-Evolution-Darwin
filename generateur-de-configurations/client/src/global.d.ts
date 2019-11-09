interface Window {
  p5: import('p5');
  animals: import('./animal/animal.class').default[];
  plants: import('./plant.class').default[];
  size: number;
  speed: number;
  time: number;
  preyConfig: any;
  predatorConfig: any;
  plantConfig: any;
}
