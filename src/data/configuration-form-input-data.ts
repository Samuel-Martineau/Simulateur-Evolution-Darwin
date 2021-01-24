import ShuffleIcon from "images/shuffle.svg";
import _ from "lodash";

import type { ConfigurationFormInputData } from "../types/configuration-form-input-data";
import type {
  AnimalGene,
  AnimalSpecie,
  SimulatorConfiguration,
  Specie,
} from "../types/simulator-configuration";
import { getRandomSeed, titleize } from "../utils";
import { genesDisplayName } from "./simulator-configuration";

const alwaysEnabled = () => false as const;
const enabledIfSpecieExists = (specie: Specie) => (
  configuration: SimulatorConfiguration
) => !configuration.species[specie].exists;

export const generalConfigurationFormInputData: ConfigurationFormInputData[] = [
  {
    type: "text",
    name: "Titre",
    glossaryId: "configuration-titre",
    description:
      "Le nom de la configuration qui va apparaître dans la barre latérale. N’a aucun impact sur la simulation en elle-même",
    required: false,
    shownInGlossary: true,
    fieldPath: "title",
    disabled: alwaysEnabled,
  },
  {
    type: "number",
    name: "« SEED »",
    glossaryId: "configuration-seed",
    description:
      "La SEED utilisée par le simulateur pour générer les nombres aléatoires. Cela permet d’avoir des résultats identiques à chaque fois que l’on roule la configuration. Pour obtenir de nouveaux nombres, il suffit donc de regénérer une nouvelle SEED",
    required: true,
    shownInGlossary: true,
    fieldPath: "seed",
    disabled: alwaysEnabled,
    action: {
      iconUrl: ShuffleIcon,
      onClick: () => getRandomSeed(),
    },
  },
  {
    type: "number",
    name: "Taille du côté de la carte",
    glossaryId: "configuration-taille-côté-carte",
    description:
      "La taille de l’écosystème dans lequel les espèces vont évoluer. Le monde est en forme de carré",
    unit: "UE",
    min: 1,
    required: true,
    shownInGlossary: true,
    fieldPath: "mapSideSize",
    disabled: alwaysEnabled,
  },
];

export const plantsSpecieConfigurationFormInputData: ConfigurationFormInputData[] = [
  {
    type: "checkbox",
    name: "Existe",
    glossaryId: "configuration-espèce-plantes-existe",
    description:
      "Si l’espèce des plantes est présente dans la simulation. À noter que tous les animaux vont éventuellement mourir sans plantes",
    required: false,
    shownInGlossary: true,
    fieldPath: "species.plant.exists",
    disabled: enabledIfSpecieExists("plant"),
  },
  {
    type: "number",
    name: "Nombre de départ",
    glossaryId: "configuration-espèce-plantes-nombre-depart",
    description: "Le nombre de plantes lorsque la simulation commence",
    unit: "Nombre de plantes",
    min: 0,
    required: true,
    shownInGlossary: true,
    fieldPath: "species.plant.startingNumber",
    disabled: enabledIfSpecieExists("plant"),
  },
  {
    type: "number",
    name: "Intervalle entre les lots d’apparition",
    glossaryId: "configuration-espèce-plantes-intervalle-entre-apparition",
    description:
      "Dans le simulateur, les plantes apparaissent à une vitesse constante. Ce champ représente l’intervalle de temps entre les lots d’apparition",
    unit: "UT",
    min: 1,
    required: true,
    shownInGlossary: true,
    fieldPath: "species.plant.spawnInterval",
    disabled: enabledIfSpecieExists("plant"),
  },
  {
    type: "number",
    name: "Nombre de plantes par lot d’apparition",
    glossaryId: "configuration-espèce-plantes-nombre-de-plantes-par-lot",
    description:
      "Dans le simulateur, les plantes apparaissent à une vitesse constante. Ce champ représente le nombre de plantes dans chaque lot d’apparition",
    unit: "Nombre de plantes",
    min: 0,
    required: true,
    shownInGlossary: true,
    fieldPath: "species.plant.spawnAmount",
    disabled: enabledIfSpecieExists("plant"),
  },
];

const getChildrenFieldForGene = (
  animalSpecie: AnimalSpecie,
  geneName: AnimalGene
): ConfigurationFormInputData[] => {
  return [
    {
      type: "select",
      name: "Type de modificateur",
      required: true,
      shownInGlossary: false,
      options: {
        constant: "Constant",
        evolutionary: "Évolutif",
      },
      fieldPath: `species.${animalSpecie}.genes.${geneName}.modificator`,
      disabled: enabledIfSpecieExists(animalSpecie),
    },
    {
      type: "number",
      name: "Valeur",
      min: 0,
      required: true,
      shownInGlossary: false,
      fieldPath: `species.${animalSpecie}.genes.${geneName}.value`,
      disabled: (conf) =>
        enabledIfSpecieExists(animalSpecie)(conf) ||
        conf.species[animalSpecie].genes[geneName].modificator !== "constant",
    },
    {
      type: "number",
      name: "Moyenne de départ",
      min: 0,
      required: true,
      shownInGlossary: false,
      fieldPath: `species.${animalSpecie}.genes.${geneName}.average`,
      disabled: (conf) =>
        enabledIfSpecieExists(animalSpecie)(conf) ||
        conf.species[animalSpecie].genes[geneName].modificator !==
          "evolutionary",
    },
    {
      type: "number",
      name: "Déviation standard de départ",
      min: 0,
      required: true,
      shownInGlossary: false,
      fieldPath: `species.${animalSpecie}.genes.${geneName}.standardDeviation`,
      disabled: (conf) =>
        enabledIfSpecieExists(animalSpecie)(conf) ||
        conf.species[animalSpecie].genes[geneName].modificator !==
          "evolutionary",
    },
    {
      type: "group",
      name: "Ajustements",
      glossaryId: "configuration-espèces-animales-gènes-ajustements",
      description:
        "Les ajustements permettent de modifier la valeur d'un gène en fonction de la valeur des autres gènes. Pour chacun des autres gènes, il est possible d'indiquer un nombre qui va être multiplier par la valeur de ce gène, puis soustrait",
      required: true,
      shownInGlossary: true,
      children: Object.entries(_.omit(genesDisplayName, geneName)).map(
        ([name, displayName]: [string, string]) => ({
          type: "number",
          name: titleize(displayName),
          step: "any",
          required: true,
          shownInGlossary: false,
          fieldPath: `species.${animalSpecie}.genes.${geneName}.adjustments.${name}`,
          disabled: alwaysEnabled,
        })
      ),
    },
  ];
};

export const getAnimalSpeciesConfigurationFormInputData = (
  animalSpecie: AnimalSpecie
): ConfigurationFormInputData[] => [
  {
    type: "checkbox",
    name: "Existe",
    glossaryId: "configuration-espèces-animales-existe",
    description:
      "Si l’espèce des proies / des prédateurs est présente dans la simulation. À noter que tous les prédateurs vont éventuellement mourir sans proies",
    required: false,
    shownInGlossary: true,
    fieldPath: `species.${animalSpecie}.exists`,
    disabled: alwaysEnabled,
  },
  {
    type: "number",
    name: "Nombre de départ",
    glossaryId: "configuration-espèces-animales-nombre-départ",
    description:
      "Le nombre de proies / prédateurs lorsque la simulation commence",
    unit: "Nombre de proies / prédateurs",
    min: 0,
    required: true,
    shownInGlossary: true,
    fieldPath: `species.${animalSpecie}.startingNumber`,
    disabled: enabledIfSpecieExists(animalSpecie),
  },
  {
    type: "group",
    name: "Gènes",
    glossaryId: "configuration-espèces-animales-gènes",
    description:
      "Les gènes sont les attributs des animaux. Les champs suivants représentent les valeurs de départ des gènes pour la population. Il y a deux possibilités de valeurs pour un gène: évolutif ou constant. Un gène de type évolutif générera les valeurs de départ sur une distribution normale en fonction d’une moyenne de départ et une déviation standard de départ",
    required: true,
    shownInGlossary: true,
    children: [
      {
        type: "group",
        name: `Gène de ${genesDisplayName["speed"]}`,
        glossaryId: `configuration-espèces-animales-gène-${_.kebabCase(
          genesDisplayName["speed"]
        )}`,
        description: `La ${genesDisplayName["speed"]} de déplacement de l’individu`,
        unit: "UE / UT",
        required: true,
        shownInGlossary: true,
        children: getChildrenFieldForGene(animalSpecie, "speed"),
      },
      {
        type: "group",
        name: `Gène du ${genesDisplayName["numberOfBabies"]}`,
        glossaryId: `configuration-espèces-animales-gène-${_.kebabCase(
          genesDisplayName["numberOfBabies"]
        )}`,
        description: `Le ${genesDisplayName["numberOfBabies"]} que vont faire deux individus lorsqu’ils vont se reproduires. À noter que la notion de sexe (masculin / féminin) n’est pas présente dans le simulateur`,
        unit: titleize(genesDisplayName["numberOfBabies"]),
        required: true,
        shownInGlossary: true,
        children: getChildrenFieldForGene(animalSpecie, "numberOfBabies"),
      },
      {
        type: "group",
        name: `Gène de l'${genesDisplayName["intervalBetweenReproductionPeriods"]}`,
        glossaryId: `configuration-espèces-animales-gène-${_.kebabCase(
          genesDisplayName["intervalBetweenReproductionPeriods"]
        )}`,
        description:
          "La quantité de temps qu’un individu doit attendre avant de pouvoir se reproduire à nouveau",
        unit: "UT",
        required: true,
        shownInGlossary: true,
        children: getChildrenFieldForGene(
          animalSpecie,
          "intervalBetweenReproductionPeriods"
        ),
      },
      {
        type: "group",
        name: `Gène de la ${genesDisplayName["viewDistance"]}`,
        glossaryId: `configuration-espèces-animales-gène-${_.kebabCase(
          genesDisplayName["viewDistance"]
        )}`,
        description:
          "La vue est le seul sens que les animaux possèdent dans le simulateur. Ce gène représente la distance maximale à laquelle ils peuvent voir de la nourriture, des partenaires de reproduction et des prédateurs",
        unit: "UE",
        required: true,
        shownInGlossary: true,
        children: getChildrenFieldForGene(animalSpecie, "viewDistance"),
      },
      {
        type: "group",
        name: `Gène de la ${genesDisplayName["longevity"]}`,
        glossaryId: `configuration-espèces-animales-gène-${_.kebabCase(
          genesDisplayName["longevity"]
        )}`,
        description: "L’âge maximum d’un individu avant qu’il ne meure",
        unit: "UT",
        required: true,
        shownInGlossary: true,
        children: getChildrenFieldForGene(animalSpecie, "longevity"),
      },
      {
        type: "group",
        name: `Gène du ${genesDisplayName["timeToEat"]}`,
        glossaryId: `configuration-espèces-animales-gène-${_.kebabCase(
          genesDisplayName["timeToEat"]
        )}`,
        description:
          "Le temps qu’un individu a pour manger la quantité de nourriture qu’il doit manger",
        unit: "UT",
        required: true,
        shownInGlossary: true,
        children: getChildrenFieldForGene(animalSpecie, "timeToEat"),
      },
      {
        type: "group",
        name: `Gène de la ${genesDisplayName["amountOfFoodToEat"]}`,
        glossaryId: `configuration-espèces-animales-gène-${_.kebabCase(
          genesDisplayName["amountOfFoodToEat"]
        )}`,
        description:
          "La quantité de nourriture (plantes pour les proies et proies pour les carnivores) que l’individu doit manger dans le temps qu’il a pour manger",
        unit: "Nombre de plantes pour les proies et proies pour les carnivores",
        required: true,
        shownInGlossary: true,
        children: getChildrenFieldForGene(animalSpecie, "amountOfFoodToEat"),
      },
    ],
  },
];
