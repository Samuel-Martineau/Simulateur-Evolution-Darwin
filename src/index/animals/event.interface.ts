import Animal from './animal.class';
export default interface Event {
  name: string;
  time: number;
  action(slef: Animal): void;
}
