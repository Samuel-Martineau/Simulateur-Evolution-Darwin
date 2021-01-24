import type { SimulatorConfiguration } from "./simulator-configuration";

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
        type: "group";
        children: ConfigurationFormInputData[];
        unit?: string;
      }
    | ({
        fieldPath: string;
        disabled: (configuration: SimulatorConfiguration) => boolean;
        action?: {
          iconUrl: string;
        };
      } & (
        | {
            type: "text";
            action?: {
              onClick: (configuration: SimulatorConfiguration) => string;
            };
          }
        | {
            type: "number";
            step?: number | "any";
            max?: number;
            min?: number;
            unit?: string;
            action?: {
              onClick: (configuration: SimulatorConfiguration) => number;
            };
          }
        | {
            type: "checkbox";
            action?: {
              onClick: (configuration: SimulatorConfiguration) => boolean;
            };
          }
        | {
            type: "select";
            options: InputSelectOptions;
            action?: {
              onClick: (configuration: SimulatorConfiguration) => string;
            };
          }
      ))
  );
