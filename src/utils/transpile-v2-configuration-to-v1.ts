import _ from "lodash";
import type { DeepPartial } from "tsdef";
import { v4 as uuidv4 } from "uuid";

import type {
  AnimalSpecie,
  AnimalSpecieConfiguration,
  SimulatorConfiguration,
} from "../types/simulator-configuration";
import {
  V1Adjustments,
  V1Gene,
  V1Modificator,
  V1SimulatorConfiguration,
} from "../types/v1-simulator-configuration";
import { applyDefaultsDeep, baseConfiguration, getRandomSeed } from ".";

export function transpileV2ConfigurationToV1(
  partialConfiguration: DeepPartial<SimulatorConfiguration>
): V1SimulatorConfiguration {
  const v2Configuration = applyDefaultsDeep(
    Object.assign(partialConfiguration, { id: uuidv4() }),
    Object.assign(baseConfiguration, { seed: getRandomSeed() })
  );

  function transpileV2Gene(
    specie: AnimalSpecie,
    geneName: keyof AnimalSpecieConfiguration["genes"],
    displayName: string,
    displayValue: string,
    v1GeneName: string = geneName,
    adjustments: V1Adjustments = {}
  ): V1Gene {
    const gene = v2Configuration.species[specie].genes[geneName];

    return {
      displayName,
      name: v1GeneName,
      modificator:
        gene.modificator === "constant"
          ? V1Modificator.Constant
          : V1Modificator.Stddev,
      avg: gene.average,
      stdDev: gene.standardDeviation,
      value: gene.value,
      displayValue,
      adjustments,
    };
  }
  const transpileV2PreyGene = _.partial(transpileV2Gene, "prey");
  const transpileV2PredatorGene = _.partial(transpileV2Gene, "predator");

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
      name: "Proie",
      startingNb: v2Configuration.species.prey.startingNumber,
      genes: [
        transpileV2PreyGene(
          "speed",
          "Vitesse",
          "${this.value.toFixed(2)} ue / ut"
        ),
        transpileV2PreyGene(
          "numberOfBabies",
          "Nombre de bébés",
          "${Math.round(this.value)} bébé${ this.value > 1 ? 's' : '' }",
          "nbOfBabies"
        ),
        transpileV2PreyGene(
          "longevity",
          "Longévité",
          "${this.value.toFixed(2)} ut"
        ),
        transpileV2PreyGene(
          "intervalBetweenReproductionPeriods",
          "Interval entre les périodes de reproduction",
          "${this.value.toFixed(2)} ut",
          "intervalBetweenReproducingPeriods"
        ),
        transpileV2PreyGene(
          "viewDistance",
          "Distance de vue",
          "${this.value.toFixed(2)} ue",
          "renderDistance"
        ),
        transpileV2PreyGene(
          "amountOfFoodToEat",
          "Nombre de plantes à manger",
          "${Math.round(this.value)} plantes",
          "hungerLevel",
          {
            speed: "Math.round(${value} * 0.05)",
          }
        ),
        transpileV2PreyGene(
          "timeToEat",
          "Temps pour manger",
          "${this.value.toFixed(2)} ue",
          "eatingInterval"
        ),
      ],
    },

    predator: {
      name: "Prédateur",
      startingNb: v2Configuration.species.predator.startingNumber,
      genes: [
        transpileV2PredatorGene(
          "speed",
          "Vitesse",
          "${this.value.toFixed(2)} ue / ut"
        ),
        transpileV2PredatorGene(
          "numberOfBabies",
          "Nombre de bébés",
          "${Math.round(this.value)} bébé${ this.value > 1 ? 's' : '' }",
          "nbOfBabies"
        ),
        transpileV2PredatorGene(
          "longevity",
          "Longévité",
          "${this.value.toFixed(2)} ut"
        ),
        transpileV2PredatorGene(
          "intervalBetweenReproductionPeriods",
          "Interval entre les périodes de reproduction",
          "${this.value.toFixed(2)} ut",
          "intervalBetweenReproducingPeriods"
        ),
        transpileV2PredatorGene(
          "viewDistance",
          "Distance de vue",
          "${this.value.toFixed(2)} ue",
          "renderDistance"
        ),
        transpileV2PredatorGene(
          "amountOfFoodToEat",
          "Nombre de plantes à manger",
          "${Math.round(this.value)} proies",
          "hungerLevel",
          {
            speed: "Math.round(${value} * 0.05)",
          }
        ),
        transpileV2PredatorGene(
          "timeToEat",
          "Temps pour manger",
          "${this.value.toFixed(2)} ue",
          "eatingInterval"
        ),
      ],
    },
  };

  return v1SimulatorConfiguration;
}
