export default interface Gene {
  name: string;
  value: number;
  modificator(parent1Value: number, parent2Value: number): number;
}
