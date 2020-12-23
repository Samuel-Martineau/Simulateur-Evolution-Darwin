import { v4 as uuidv4 } from 'uuid';
import type { Dependency } from './types/dependency';
import type { SimulatorConfiguration } from './types/simulator-configuration';

export const generateBaseConfiguration = (): SimulatorConfiguration => ({
  id: uuidv4(),
  title: 'Sans titre',

  seed: uuidv4(),
  mapSideSize: 8000,

  species: {
    prey: {
      exists: false,
      startingNumber: 1,
      genes: {
        speed: {
          modificator: 'constant',
          value: 0,
          average: 0,
          standardDeviation: 0,
        },
        numberOfBabies: {
          modificator: 'constant',
          value: 0,
          average: 0,
          standardDeviation: 0,
        },
        intervalBetweenReproductionPeriods: {
          modificator: 'constant',
          value: 0,
          average: 0,
          standardDeviation: 0,
        },
        viewDistance: {
          modificator: 'constant',
          value: 0,
          average: 0,
          standardDeviation: 0,
        },
        longevity: {
          modificator: 'constant',
          value: 0,
          average: 0,
          standardDeviation: 0,
        },
        amountOfFoodToEat: {
          modificator: 'constant',
          value: 0,
          average: 0,
          standardDeviation: 0,
        },
        timeToEat: {
          modificator: 'constant',
          value: 0,
          average: 0,
          standardDeviation: 0,
        },
      },
    },

    predator: {
      exists: false,
      startingNumber: 1,
      genes: {
        speed: {
          modificator: 'constant',
          value: 0,
          average: 0,
          standardDeviation: 0,
        },
        numberOfBabies: {
          modificator: 'constant',
          value: 0,
          average: 0,
          standardDeviation: 0,
        },
        intervalBetweenReproductionPeriods: {
          modificator: 'constant',
          value: 0,
          average: 0,
          standardDeviation: 0,
        },
        viewDistance: {
          modificator: 'constant',
          value: 0,
          average: 0,
          standardDeviation: 0,
        },
        longevity: {
          modificator: 'constant',
          value: 0,
          average: 0,
          standardDeviation: 0,
        },
        amountOfFoodToEat: {
          modificator: 'constant',
          value: 0,
          average: 0,
          standardDeviation: 0,
        },
        timeToEat: {
          modificator: 'constant',
          value: 0,
          average: 0,
          standardDeviation: 0,
        },
      },
    },

    plant: {
      exists: false,
      startingNumber: 0,
      spawnRate: 0,
      spawnInterval: 1,
    },
  },
});

export function toFactory<T extends (...args: any[]) => any>(
  func: T,
  ...args: Parameters<T>
): () => ReturnType<T> {
  return () => func(...args);
}

export function parseDependency([name, versionRange]: [
  string,
  string,
]): Dependency {
  return {
    name,
    version: versionRange.slice(1),
    url: `https://npmjs.com/package/${name}/v/${versionRange.slice(1)}`,
  };
}

export function scrollIntoView(
  selector: string,
  container: HTMLElement | Window,
  offset: number,
) {
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) throw new Error(`Element "${element}" doesn't exist`);

  setTimeout(() =>
    container.scrollBy({ top: element.getBoundingClientRect().top - offset }),
  );
}
