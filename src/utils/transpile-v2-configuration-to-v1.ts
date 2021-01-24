import _ from "lodash";
import type { DeepPartial } from "tsdef";
import { v4 as uuidv4 } from "uuid";

import { genesDisplayName, v1GenesName } from "../data/simulator-configuration";
import type {
  AnimalGene,
  AnimalSpecie,
  SimulatorConfiguration,
} from "../types/simulator-configuration";
import {
  V1Gene,
  V1Modificator,
  V1SimulatorConfiguration,
} from "../types/v1-simulator-configuration";
import { applyDefaultsDeep, generateBaseConfiguration, titleize } from ".";

export function transpileV2ConfigurationToV1(
  partialConfiguration: DeepPartial<SimulatorConfiguration>
): V1SimulatorConfiguration {
  const v2Configuration = applyDefaultsDeep(
    Object.assign(partialConfiguration, { id: uuidv4() }),
    generateBaseConfiguration()
  );

  function transpileV2Gene(
    specie: AnimalSpecie,
    geneName: AnimalGene,
    displayValue: string
  ): V1Gene {
    const v1GeneName = v1GenesName[geneName];
    const gene = v2Configuration.species[specie].genes[geneName];

    return {
      displayName: titleize(genesDisplayName[geneName]),
      name: v1GeneName,
      modificator:
        gene.modificator === "constant"
          ? V1Modificator.Constant
          : V1Modificator.Stddev,
      avg: gene.average,
      stdDev: gene.standardDeviation,
      value: gene.value,
      displayValue,
      adjustments: _.transform(
        gene.adjustments,
        (result, value, key) => {
          if (value === 0) return;
          result[v1GenesName[key]] = `Math.round(\${value} * ${value})`;
        },
        {}
      ),
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
        transpileV2PreyGene("speed", "${this.value.toFixed(2)} ue / ut"),
        transpileV2PreyGene(
          "numberOfBabies",
          "${Math.round(this.value)} bébé${ this.value > 1 ? 's' : '' }"
        ),
        transpileV2PreyGene("longevity", "${this.value.toFixed(2)} ut"),
        transpileV2PreyGene(
          "intervalBetweenReproductionPeriods",
          "${this.value.toFixed(2)} ut"
        ),
        transpileV2PreyGene("viewDistance", "${this.value.toFixed(2)} ue"),
        transpileV2PreyGene(
          "amountOfFoodToEat",
          "${Math.round(this.value)} plantes"
        ),
        transpileV2PreyGene("timeToEat", "${this.value.toFixed(2)} ue"),
      ],
    },

    predator: {
      name: "Prédateur",
      startingNb: v2Configuration.species.predator.startingNumber,
      genes: [
        transpileV2PredatorGene("speed", "${this.value.toFixed(2)} ue / ut"),
        transpileV2PredatorGene(
          "numberOfBabies",
          "${Math.round(this.value)} bébé${ this.value > 1 ? 's' : '' }"
        ),
        transpileV2PredatorGene("longevity", "${this.value.toFixed(2)} ut"),
        transpileV2PredatorGene(
          "intervalBetweenReproductionPeriods",
          "${this.value.toFixed(2)} ut"
        ),
        transpileV2PredatorGene("viewDistance", "${this.value.toFixed(2)} ue"),
        transpileV2PredatorGene(
          "amountOfFoodToEat",
          "${Math.round(this.value)} proies"
        ),
        transpileV2PredatorGene("timeToEat", "${this.value.toFixed(2)} ue"),
      ],
    },
  };

  return v1SimulatorConfiguration;
}
