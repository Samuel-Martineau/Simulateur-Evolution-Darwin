export default interface Gene {
  displayName: string;
  name: string;
  value: number;
  modificator(parent1Value: number, parent2Value: number): number;
}
