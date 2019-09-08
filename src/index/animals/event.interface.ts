import { Animal } from './animal.class';
export interface Event {
  name: string;
  time: number;
  action(slef: Animal): void;
}
