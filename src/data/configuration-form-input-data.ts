import type { ConfigurationFormInputData } from '../types/configuration-form-input-data';
import type {
  AnimalSpecie,
  SimulatorConfiguration,
  Specie,
} from '../types/simulator-configuration';
import ShuffleIcon from 'images/shuffle.svg';
import { v4 as uuidv4 } from 'uuid';
import { getRandomSeed } from '../utils';

const alwaysEnabled = () => false as const;
const enabledIfSpecieExists = (specie: Specie) => (
  configuration: SimulatorConfiguration,
) => !configuration.species[specie].exists;

export const generalConfigurationFormInputData: ConfigurationFormInputData[] = [
  {
    type: 'text',
    name: 'Titre',
    glossaryId: 'configuration-titre',
    description:
      'Le nom de la configuration qui va apparaître dans la barre latérale. N’a aucun impact sur la simulation en elle-même',
    required: false,
    shownInGlossary: true,
    fieldPath: 'title',
    disabled: alwaysEnabled,
  },
  {
    type: 'number',
    name: '« SEED »',
    glossaryId: 'configuration-seed',
    description:
      'La SEED utilisée par le simulateur pour générer les nombres aléatoires. Cela permet d’avoir des résultats identiques à chaque fois que l’on roule la configuration. Pour obtenir de nouveaux nombres, il suffit donc de regénérer une nouvelle SEED',
    required: true,
    shownInGlossary: true,
    fieldPath: 'seed',
    disabled: alwaysEnabled,
    action: {
      iconUrl: ShuffleIcon,
      onClick: () => getRandomSeed(),
    },
  },
  {
    type: 'number',
    name: 'Taille du côté de la carte',
    glossaryId: 'configuration-taille-côté-carte',
    description:
      'La taille de l’écosystème dans lequel les espèces vont évoluer. Le monde est en forme de carré',
    unit: 'UE',
    min: 1,
    required: true,
    shownInGlossary: true,
    fieldPath: 'mapSideSize',
    disabled: alwaysEnabled,
  },
];

export const plantsSpecieConfigurationFormInputData: ConfigurationFormInputData[] = [
  {
    type: 'checkbox',
    name: 'Existe',
    glossaryId: 'configuration-espèce-plantes-existe',
    description:
      'Si l’espèce des plantes est présente dans la simulation. À noter que tous les animaux vont éventuellement mourir sans plantes',
    required: false,
    shownInGlossary: true,
    fieldPath: 'species.plant.exists',
    disabled: enabledIfSpecieExists('plant'),
  },
  {
    type: 'number',
    name: 'Nombre de départ',
    glossaryId: 'configuration-espèce-plantes-nombre-depart',
    description: 'Le nombre de plantes lorsque la simulation commence',
    unit: 'Nombre de plantes',
    min: 0,
    required: true,
    shownInGlossary: true,
    fieldPath: 'species.plant.startingNumber',
    disabled: enabledIfSpecieExists('plant'),
  },
  {
    type: 'number',
    name: 'Interval entre les lots d’apparition',
    glossaryId: 'configuration-espèce-plantes-interval-entre-apparition',
    description:
      'Dans le simulateur, les plantes apparaissent à une vitesse constante. Ce champ représente l’interval de temps entre les lots d’apparition',
    unit: 'UT',
    min: 1,
    required: true,
    shownInGlossary: true,
    fieldPath: 'species.plant.spawnInterval',
    disabled: enabledIfSpecieExists('plant'),
  },
  {
    type: 'number',
    name: 'Nombre de plantes par lot d’apparition',
    glossaryId: 'configuration-espèce-plantes-nombre-de-plantes-par-lot',
    description:
      'Dans le simulateur, les plantes apparaissent à une vitesse constante. Ce champ représente le nombre de plantes dans chaque lot d’apparition',
    unit: 'Nombre de plantes',
    min: 0,
    required: true,
    shownInGlossary: true,
    fieldPath: 'species.plant.spawnAmount',
    disabled: enabledIfSpecieExists('plant'),
  },
];

const getChildrenFieldForGene = (
  animalSpecie: AnimalSpecie,
  geneConfigPath: keyof SimulatorConfiguration['species'][AnimalSpecie]['genes'],
): ConfigurationFormInputData[] => [
  {
    type: 'select',
    name: 'Type de modificateur',
    required: true,
    shownInGlossary: false,
    options: {
      constant: 'Constant',
      evolutionary: 'Évolutif',
    },
    fieldPath: `species.${animalSpecie}.genes.${geneConfigPath}.modificator`,
    disabled: enabledIfSpecieExists(animalSpecie),
  },
  {
    type: 'number',
    name: 'Valeur',
    min: 0,
    required: true,
    shownInGlossary: false,
    fieldPath: `species.${animalSpecie}.genes.${geneConfigPath}.value`,
    disabled: (conf) =>
      enabledIfSpecieExists(animalSpecie)(conf) ||
      conf.species[animalSpecie].genes[geneConfigPath].modificator !==
        'constant',
  },
  {
    type: 'number',
    name: 'Moyenne de départ',
    min: 0,
    required: true,
    shownInGlossary: false,
    fieldPath: `species.${animalSpecie}.genes.${geneConfigPath}.average`,
    disabled: (conf) =>
      enabledIfSpecieExists(animalSpecie)(conf) ||
      conf.species[animalSpecie].genes[geneConfigPath].modificator !==
        'evolutionary',
  },
  {
    type: 'number',
    name: 'Déviation standard de départ',
    min: 0,
    required: true,
    shownInGlossary: false,
    fieldPath: `species.${animalSpecie}.genes.${geneConfigPath}.standardDeviation`,
    disabled: (conf) =>
      enabledIfSpecieExists(animalSpecie)(conf) ||
      conf.species[animalSpecie].genes[geneConfigPath].modificator !==
        'evolutionary',
  },
];

export const getAnimalSpeciesConfigurationFormInputData = (
  animalSpecie: AnimalSpecie,
): ConfigurationFormInputData[] => [
  {
    type: 'checkbox',
    name: 'Existe',
    glossaryId: 'configuration-espèces-animales-existe',
    description:
      'Si l’espèce des proies / des prédateurs est présente dans la simulation. À noter que tous les prédateurs vont éventuellement mourir sans proies',
    required: false,
    shownInGlossary: true,
    fieldPath: `species.${animalSpecie}.exists`,
    disabled: alwaysEnabled,
  },
  {
    type: 'number',
    name: 'Nombre de départ',
    glossaryId: 'configuration-espèces-animales-nombre-départ',
    description:
      'Le nombre de proies / prédateurs lorsque la simulation commence',
    unit: 'Nombre de proies / prédateurs',
    min: 0,
    required: true,
    shownInGlossary: true,
    fieldPath: `species.${animalSpecie}.startingNumber`,
    disabled: enabledIfSpecieExists(animalSpecie),
  },
  {
    type: 'group',
    name: 'Gênes',
    glossaryId: 'configuration-espèces-animales-gênes',
    description:
      'Les gênes sont les attributs des animaux. Les champs suivants représentent les valeurs de départ des gênes pour la population. Il y a deux possibilités de valeurs pour un gêne: évolutif ou constant. Un gêne de type évolutif générera les valeurs de départ sur une distribution normale en fonction d’une moyenne de départ et une déviation standard de départ',
    required: true,
    shownInGlossary: true,
    children: [
      {
        type: 'group',
        name: 'Gêne de vitesse',
        glossaryId: 'configuration-espèces-animales-gêne-vitesse',
        description: 'La vitesse de déplacement de l’individu',
        unit: 'UE / UT',
        required: true,
        shownInGlossary: true,
        children: getChildrenFieldForGene(animalSpecie, 'speed'),
      },
      {
        type: 'group',
        name: 'Gêne du nombre de bébés',
        glossaryId: 'configuration-espèces-animales-gêne-nombre-bébés',
        description:
          'Le nombre de bébés que vont faire deux individus lorsqu’ils vont se reproduires. À noter que la notion de sexe (masculin / féminin) n’est pas présente dans le simulateur',
        unit: 'Nombre de bébés',
        required: true,
        shownInGlossary: true,
        children: getChildrenFieldForGene(animalSpecie, 'numberOfBabies'),
      },
      {
        type: 'group',
        name: "Gêne de l'interval entre les périodes de reproduction",
        glossaryId:
          'configuration-espèces-animales-gêne-interval-périodes-reproduction',
        description:
          'La quantité de temps qu’un individu doit attendre avant de pouvoir se reproduire à nouveau',
        unit: 'UT',
        required: true,
        shownInGlossary: true,
        children: getChildrenFieldForGene(
          animalSpecie,
          'intervalBetweenReproductionPeriods',
        ),
      },
      {
        type: 'group',
        name: 'Gêne de la distance de vue',
        glossaryId: 'configuration-espèces-animales-gêne-distance-vue',
        description:
          'La vue est le seul sens que les animaux possèdent dans le simulateur. Ce gène représente la distance maximale à laquelle ils peuvent voir de la nourriture, des partenaires de reproduction et des prédateurs',
        unit: 'UE',
        required: true,
        shownInGlossary: true,
        children: getChildrenFieldForGene(animalSpecie, 'viewDistance'),
      },
      {
        type: 'group',
        name: 'Gêne de la longévité',
        glossaryId: 'configuration-espèces-animales-gêne-longévité',
        description: 'L’âge maximum d’un individu avant qu’il ne meure',
        unit: 'UT',
        required: true,
        shownInGlossary: true,
        children: getChildrenFieldForGene(animalSpecie, 'longevity'),
      },
      {
        type: 'group',
        name: 'Gêne du temps pour manger',
        glossaryId: 'configuration-espèces-animales-gêne-temps-pour-manger',
        description:
          'Le temps qu’un individu a pour manger la quantité de nourriture qu’il doit manger',
        unit: 'UT',
        required: true,
        shownInGlossary: true,
        children: getChildrenFieldForGene(animalSpecie, 'timeToEat'),
      },
      {
        type: 'group',
        name: 'Gêne de la quantité de nourriture à manger',
        glossaryId:
          'configuration-espèces-animales-gêne-quantité-nourriture-à-manger',
        description:
          'La quantité de nourriture (plantes pour les proies et proies pour les carnivores) que l’individu doit manger dans le temps qu’il a pour manger',
        unit: 'Nombre de plantes pour les proies et proies pour les carnivores',
        required: true,
        shownInGlossary: true,
        children: getChildrenFieldForGene(animalSpecie, 'amountOfFoodToEat'),
      },
    ],
  },
];
