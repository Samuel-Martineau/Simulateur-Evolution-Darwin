import type { SimulatorConfiguration } from './simulator-configuration';

export type InputSelectOptions = { [key: string]: string };

export type ConfigurationFormInputData = {
  name: string;
  required: boolean;
} & (
  | { shownInGlossary: false }
  | {
      shownInGlossary: true;
      description: string;
      glossaryId: string;
    }
) &
  (
    | {
        type: 'group';
        children: ConfigurationFormInputData[];
        unit?: string;
      }
    | ({
        fieldPath: string;
        disabled: (configuration: SimulatorConfiguration) => boolean;
      } & (
        | {
            type: 'text';
          }
        | {
            type: 'number';
            step?: number;
            max?: number;
            min?: number;
            unit?: string;
          }
        | {
            type: 'checkbox';
          }
        | {
            type: 'select';
            options: InputSelectOptions;
          }
      ))
  );
