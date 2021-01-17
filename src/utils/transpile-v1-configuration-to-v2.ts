import _ from "lodash";
import type { DeepPartial } from "tsdef";
import { v4 as uuidv4 } from "uuid";

import type {
  AnimalSpecie,
  GeneConfiguration,
  SimulatorConfiguration,
} from "../types/simulator-configuration";
import {
  V1Modificator,
  V1SimulatorConfiguration,
} from "../types/v1-simulator-configuration";
import { applyDefaultsDeep, baseConfiguration, getRandomSeed } from ".";

export function transpileV1ConfigurationToV2(
  v1Configuration: DeepPartial<V1SimulatorConfiguration>
): SimulatorConfiguration {
  function transpileV1Gene(
    specie: AnimalSpecie,
    v1GeneName: string
  ): Partial<GeneConfiguration> | undefined {
    const v1Gene = v1Configuration[specie]?.genes?.find(
      (g) => g.name === v1GeneName
    );
    if (!v1Gene) return;
    return {
      modificator:
        v1Gene.modificator === V1Modificator.Constant
          ? "constant"
          : "evolutionary",
      value: v1Gene.value,
      average: v1Gene.avg,
      standardDeviation: v1Gene.stdDev,
    };
  }

  const transpileV1PreyGene = _.partial(transpileV1Gene, "prey");
  const transpileV1PredatorGene = _.partial(transpileV1Gene, "predator");

  const partialConfiguration: DeepPartial<SimulatorConfiguration> = {
    version: "2",

    id: uuidv4(),
    mapSideSize: v1Configuration.size,
    seed: v1Configuration.seed,

    species: {
      prey: {
        exists: (v1Configuration.prey?.startingNb || 0) > 0,
        startingNumber: v1Configuration.prey?.startingNb,
        genes: {
          speed: transpileV1PreyGene("speed"),
          numberOfBabies: transpileV1PreyGene("nbOfBabies"),
          longevity: transpileV1PreyGene("longevity"),
          intervalBetweenReproductionPeriods: transpileV1PreyGene(
            "intervalBetweenReproducingPeriods"
          ),
          viewDistance: transpileV1PreyGene("renderDistance"),
          amountOfFoodToEat: transpileV1PreyGene("hungerLevel"),
          timeToEat: transpileV1PreyGene("eatingInterval"),
        },
      },

      predator: {
        exists: (v1Configuration.predator?.startingNb || 0) > 0,
        startingNumber: v1Configuration.predator?.startingNb,
        genes: {
          speed: transpileV1PredatorGene("speed"),
          numberOfBabies: transpileV1PredatorGene("nbOfBabies"),
          longevity: transpileV1PredatorGene("longevity"),
          intervalBetweenReproductionPeriods: transpileV1PredatorGene(
            "intervalBetweenReproducingPeriods"
          ),
          viewDistance: transpileV1PredatorGene("renderDistance"),
          amountOfFoodToEat: transpileV1PredatorGene("hungerLevel"),
          timeToEat: transpileV1PredatorGene("eatingInterval"),
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
    Object.assign(baseConfiguration, { seed: getRandomSeed() })
  );

  return v2Configuration;
}
