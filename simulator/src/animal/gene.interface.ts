export default interface Gene {
  displayName: string;
  name: string;
  value: number;
  modificator: 'constant' | 'average' | 'stddev';
  displayValue(): string;
  adjustments: Record<string, string>;
}
