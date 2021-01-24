import _ from "lodash";
import type { DeepPartial } from "tsdef";
import { v4 as uuidv4 } from "uuid";

import { v1GenesName } from "../data/simulator-configuration";
import type {
  AnimalGene,
  AnimalSpecie,
  GeneConfiguration,
  SimulatorConfiguration,
} from "../types/simulator-configuration";
import {
  V1Modificator,
  V1SimulatorConfiguration,
} from "../types/v1-simulator-configuration";
import { applyDefaultsDeep, generateBaseConfiguration } from ".";

export function transpileV1ConfigurationToV2(
  v1Configuration: DeepPartial<V1SimulatorConfiguration>
): SimulatorConfiguration {
  function transpileV1Gene<T extends AnimalGene>(
    specie: AnimalSpecie,
    geneName: T
  ): DeepPartial<GeneConfiguration<T>> | undefined {
    const v1Gene = v1Configuration[specie]?.genes?.find(
      (g) => g.name === v1GenesName[geneName]
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
      adjustments: _.chain(v1Gene.adjustments || {})
        .transform((result, v1Value, v1Name) => {
          if (typeof v1Value !== "string") return;

          const v2Name = _.invert(v1GenesName)[v1Name];
          if (!v2Name) return;

          const regex = /Math\s*.\s*round\s*\(\s*\${\s*value\s*}\s*\*\s*(\d*.\d*)\s*\)/;
          const v2Value = parseFloat((v1Value.match(regex) || [])[1]);

          if (!isNaN(v2Value)) result[v2Name] = v2Value;
        }, {})
        .omit(geneName)
        .value() as any,
    };
  }

  type TranspileV1GeneForSpecie = <T extends AnimalGene>(
    geneName: T
  ) => DeepPartial<GeneConfiguration<T>> | undefined;
  const transpileV1PreyGene = _.partial(
    transpileV1Gene,
    "prey"
  ) as TranspileV1GeneForSpecie;
  const transpileV1PredatorGene = _.partial(
    transpileV1Gene,
    "predator"
  ) as TranspileV1GeneForSpecie;

  const partialConfiguration: DeepPartial<SimulatorConfiguration> = {
    version: "2",

    title: v1Configuration.name,
    id: uuidv4(),
    mapSideSize: v1Configuration.size,
    seed: v1Configuration.seed,

    species: {
      prey: {
        exists: (v1Configuration.prey?.startingNb || 0) > 0,
        startingNumber: v1Configuration.prey?.startingNb,
        genes: {
          speed: transpileV1PreyGene("speed"),
          numberOfBabies: transpileV1PreyGene("numberOfBabies"),
          longevity: transpileV1PreyGene("longevity"),
          intervalBetweenReproductionPeriods: transpileV1PreyGene(
            "intervalBetweenReproductionPeriods"
          ),
          viewDistance: transpileV1PreyGene("viewDistance"),
          amountOfFoodToEat: transpileV1PreyGene("amountOfFoodToEat"),
          timeToEat: transpileV1PreyGene("timeToEat"),
        },
      },

      predator: {
        exists: (v1Configuration.predator?.startingNb || 0) > 0,
        startingNumber: v1Configuration.predator?.startingNb,
        genes: {
          speed: transpileV1PredatorGene("speed"),
          numberOfBabies: transpileV1PredatorGene("numberOfBabies"),
          longevity: transpileV1PredatorGene("longevity"),
          intervalBetweenReproductionPeriods: transpileV1PredatorGene(
            "intervalBetweenReproductionPeriods"
          ),
          viewDistance: transpileV1PredatorGene("viewDistance"),
          amountOfFoodToEat: transpileV1PredatorGene("amountOfFoodToEat"),
          timeToEat: transpileV1PredatorGene("timeToEat"),
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
    generateBaseConfiguration()
  );

  return v2Configuration;
}
