import { v1, v4 as uuidv4 } from 'uuid';
import type { Dependency } from './types/dependency';
import type {
  AnimalSpecie,
  AnimalSpecieConfiguration,
  GeneConfiguration,
  SimulatorConfiguration,
} from './types/simulator-configuration';
import _ from 'lodash';
import {
  V1Adjustments,
  V1Gene,
  V1Modificator,
  V1SimulatorConfiguration,
} from './types/v1-simulator-configuration';
import type { DeepPartial } from 'tsdef';

export const getRandomSeed = () => Math.round(Math.random() * 100_000);

export const baseConfiguration = {
  version: '2',

  id: '0',
  title: '',
  seed: 0,
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
      spawnAmount: 0,
      spawnInterval: 1,
    },
  },
} as SimulatorConfiguration;

export const isV2SimulatorConfiguration = (
  configuration: SimulatorConfiguration | V1SimulatorConfiguration,
): configuration is SimulatorConfiguration =>
  (configuration as any).version === '2';

export const generateBaseConfiguration = (): SimulatorConfiguration =>
  _.defaultsDeep(
    { id: uuidv4(), title: 'Nouvelle configuration', seed: getRandomSeed() },
    baseConfiguration,
  );

export const transpileV1ConfigurationToV2 = (
  v1Configuration: DeepPartial<V1SimulatorConfiguration>,
): SimulatorConfiguration => {
  function transpileV1Gene(
    specie: AnimalSpecie,
    v1GeneName: string,
  ): Partial<GeneConfiguration> | undefined {
    const v1Gene = v1Configuration[specie]?.genes?.find(
      (g) => g.name === v1GeneName,
    );
    if (!v1Gene) return;
    return {
      modificator:
        v1Gene.modificator === V1Modificator.Constant
          ? 'constant'
          : 'evolutionary',
      value: v1Gene.value,
      average: v1Gene.avg,
      standardDeviation: v1Gene.stdDev,
    };
  }

  const transpileV1PreyGene = _.partial(transpileV1Gene, 'prey');
  const transpileV1PredatorGene = _.partial(transpileV1Gene, 'predator');

  const partialConfiguration: DeepPartial<SimulatorConfiguration> = {
    version: '2',

    id: uuidv4(),
    mapSideSize: v1Configuration.size,
    seed: v1Configuration.seed,

    species: {
      prey: {
        exists: (v1Configuration.prey?.startingNb || 0) > 0,
        startingNumber: v1Configuration.prey?.startingNb,
        genes: {
          speed: transpileV1PreyGene('speed'),
          numberOfBabies: transpileV1PreyGene('nbOfBabies'),
          longevity: transpileV1PreyGene('longevity'),
          intervalBetweenReproductionPeriods: transpileV1PreyGene(
            'intervalBetweenReproducingPeriods',
          ),
          viewDistance: transpileV1PreyGene('renderDistance'),
          amountOfFoodToEat: transpileV1PreyGene('hungerLevel'),
          timeToEat: transpileV1PreyGene('eatingInterval'),
        },
      },

      predator: {
        exists: (v1Configuration.predator?.startingNb || 0) > 0,
        startingNumber: v1Configuration.predator?.startingNb,
        genes: {
          speed: transpileV1PredatorGene('speed'),
          numberOfBabies: transpileV1PredatorGene('nbOfBabies'),
          longevity: transpileV1PredatorGene('longevity'),
          intervalBetweenReproductionPeriods: transpileV1PredatorGene(
            'intervalBetweenReproducingPeriods',
          ),
          viewDistance: transpileV1PredatorGene('renderDistance'),
          amountOfFoodToEat: transpileV1PredatorGene('hungerLevel'),
          timeToEat: transpileV1PredatorGene('eatingInterval'),
        },
      },

      plant: {
        exists:
          (v1Configuration.plant?.startingNb || 0) > 0 ||
          ((v1Configuration.plant?.spawnRate || 0) > 0 &&
            (v1Configuration.plant?.spawnInterval || 0) > 0),
        startingNumber: v1Configuration.plant?.startingNb,
        spawnAmount: v1Configuration.plant?.spawnRate,
        spawnInterval: v1Configuration.plant?.spawnInterval,
      },
    },
  };

  const v2Configuration = applyDefaultsDeep(
    Object.assign(partialConfiguration, { id: uuidv4() }),
    Object.assign(baseConfiguration, { seed: getRandomSeed() }),
  );

  return v2Configuration;
};

export const transpileV2ConfigurationToV1 = (
  partialConfiguration: DeepPartial<SimulatorConfiguration>,
): V1SimulatorConfiguration => {
  const v2Configuration = applyDefaultsDeep(
    Object.assign(partialConfiguration, { id: uuidv4() }),
    Object.assign(baseConfiguration, { seed: getRandomSeed() }),
  );

  function transpileV2Gene(
    specie: AnimalSpecie,
    geneName: keyof AnimalSpecieConfiguration['genes'],
    displayName: string,
    displayValue: string,
    v1GeneName: string = geneName,
    adjustments: V1Adjustments = {},
  ): V1Gene {
    const gene = v2Configuration.species[specie].genes[geneName];

    return {
      displayName,
      name: v1GeneName,
      modificator:
        gene.modificator === 'constant'
          ? V1Modificator.Constant
          : V1Modificator.Stddev,
      avg: gene.average,
      stdDev: gene.standardDeviation,
      value: gene.value,
      displayValue,
      adjustments,
    };
  }
  const transpileV2PreyGene = _.partial(transpileV2Gene, 'prey');
  const transpileV2PredatorGene = _.partial(transpileV2Gene, 'predator');

  const v1SimulatorConfiguration: V1SimulatorConfiguration = {
    size: v2Configuration.mapSideSize,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    speed: 1,
    seed: v2Configuration.seed,
    nbOfAnimalsSnapshotInterval: 50,

    plant: {
      startingNb: v2Configuration.species.plant.startingNumber,
      spawnInterval: v2Configuration.species.plant.spawnInterval,
      spawnRate: v2Configuration.species.plant.spawnAmount,
    },

    prey: {
      name: 'Proie',
      startingNb: v2Configuration.species.prey.startingNumber,
      genes: [
        transpileV2PreyGene(
          'speed',
          'Vitesse',
          '${this.value.toFixed(2)} ue / ut',
        ),
        transpileV2PreyGene(
          'numberOfBabies',
          'Nombre de bébés',
          "${Math.round(this.value)} bébé${ this.value > 1 ? 's' : '' }",
          'nbOfBabies',
        ),
        transpileV2PreyGene(
          'longevity',
          'Longévité',
          '${this.value.toFixed(2)} ut',
        ),
        transpileV2PreyGene(
          'intervalBetweenReproductionPeriods',
          'Interval entre les périodes de reproduction',
          '${this.value.toFixed(2)} ut',
          'intervalBetweenReproducingPeriods',
        ),
        transpileV2PreyGene(
          'viewDistance',
          'Distance de vue',
          '${this.value.toFixed(2)} ue',
          'renderDistance',
        ),
        transpileV2PreyGene(
          'amountOfFoodToEat',
          'Nombre de plantes à manger',
          '${Math.round(this.value)} plantes',
          'hungerLevel',
          {
            speed: 'Math.round(${value} * 0.05)',
          },
        ),
        transpileV2PreyGene(
          'timeToEat',
          'Temps pour manger',
          '${this.value.toFixed(2)} ue',
          'eatingInterval',
        ),
      ],
    },

    predator: {
      name: 'Prédateur',
      startingNb: v2Configuration.species.predator.startingNumber,
      genes: [
        transpileV2PredatorGene(
          'speed',
          'Vitesse',
          '${this.value.toFixed(2)} ue / ut',
        ),
        transpileV2PredatorGene(
          'numberOfBabies',
          'Nombre de bébés',
          "${Math.round(this.value)} bébé${ this.value > 1 ? 's' : '' }",
          'nbOfBabies',
        ),
        transpileV2PredatorGene(
          'longevity',
          'Longévité',
          '${this.value.toFixed(2)} ut',
        ),
        transpileV2PredatorGene(
          'intervalBetweenReproductionPeriods',
          'Interval entre les périodes de reproduction',
          '${this.value.toFixed(2)} ut',
          'intervalBetweenReproducingPeriods',
        ),
        transpileV2PredatorGene(
          'viewDistance',
          'Distance de vue',
          '${this.value.toFixed(2)} ue',
          'renderDistance',
        ),
        transpileV2PredatorGene(
          'amountOfFoodToEat',
          'Nombre de plantes à manger',
          '${Math.round(this.value)} proies',
          'hungerLevel',
          {
            speed: 'Math.round(${value} * 0.05)',
          },
        ),
        transpileV2PredatorGene(
          'timeToEat',
          'Temps pour manger',
          '${this.value.toFixed(2)} ue',
          'eatingInterval',
        ),
      ],
    },
  };

  return v1SimulatorConfiguration;
};

export function applyDefaultsDeep<T>(
  obj: DeepPartial<T> & { [key: string]: any },
  src: T,
): T {
  return _.assignInWith(obj, src, (objValue, srcValue) => {
    if (_.isObject(objValue) && _.isObject(srcValue))
      return _.pick(applyDefaultsDeep(objValue, srcValue), _.keys(srcValue));
    if (!_.isObject(objValue) && _.isObject(srcValue)) return srcValue;
    else if (_.isUndefined(objValue) || _.isNull(objValue)) return srcValue;
    else if (typeof objValue !== typeof srcValue) return srcValue;
    else return objValue;
  });
}

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

export const pluralize = (str: string, condition: boolean, end = 's') =>
  str + (condition ? end : '');
