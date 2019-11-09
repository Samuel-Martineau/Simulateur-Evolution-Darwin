import Animal from './animal.class';

export default interface Event {
  name: string;
  time: number;
  action(self: Animal): void;
  data?: ((self: Animal) => any)[];
}
