import p5 from 'p5';
import {
  updateAverageSpeed,
  stdDev,
  showAverageSpeedChart,
  showSpeedCurve,
  showChangeSpeedDialog,
  showStatsOfAnimal,
  showChangeScaleDialog,
  exportToCSV
} from './helpers';
import Predator from './animal/predator.class';
import Prey from './animal/prey.class';
import _ from 'lodash';
import { enableLogger, disableLogger } from './helpers';
import Logger from './logger.class';

export const createDomElements = (controlPanelDiv: p5.Element) => {
  window.p5
    .createButton('Voir le diagramme des vitesses moyennes selon les générations')
    .addClass('bouton turquoise')
    .parent(controlPanelDiv)
    .mousePressed(window.showAverageSpeedChart);
  window.p5
    .createButton("Voir la courbe du nombre d'individus selon leur vitesse")
    .addClass('bouton bleu')
    .parent(controlPanelDiv)
    .mousePressed(window.showSpeedCurve);
  window.p5
    .createButton('Changer la vitesse')
    .addClass('bouton mauve')
    .parent(controlPanelDiv)
    .mousePressed(window.showChangeSpeedDialog);
  window.p5
    .createButton("Changer l'échelle")
    .addClass('bouton bleu')
    .parent(controlPanelDiv)
    .mousePressed(window.showChangeScaleDialog);
  window.p5
    .createButton('Exporter les données en CSV')
    .addClass('bouton rouge')
    .parent(controlPanelDiv)
    .mousePressed(window.exportToCSV);
  window.p5
    .createButton('Voir le travail de recherche')
    .addClass('bouton orange')
    .parent(controlPanelDiv)
    .mousePressed(
      () =>
        (location.href =
          'https://docs.google.com/document/d/1-0XiVGQqNu3fPAFKN3vtxdBR2Abm4OA3ouX9kTg74Gk')
    );
  Logger('info', 'createDomElements')('Les éléments du DOM ont été créés');
};

export const createAnimals = () => {
  for (let i = 0; i < window.preyConfig.startingNb; i++) {
    window.animals.push(
      new Prey({
        x: window.p5.random(0, window.size),
        y: window.p5.random(0, window.size),
        genes: [
          {
            displayName: 'Vitesse',
            name: 'speed',
            value: window.p5.randomGaussian(
              window.preyConfig.avgSpeed,
              window.preyConfig.stdDevSpeed
            ),
            modificator: (parent1Value: number, parent2Value: number) => {
              const mean = _.mean([parent1Value, parent2Value]);
              const std = stdDev([parent1Value, parent2Value]);
              let val = window.p5.randomGaussian(mean, std);
              if (val < 0) val = 0.5;
              return val;
            },
            displayValue() {
              return `${(this.value * window.ut).toFixed(2)} ${window.ueUnit} / ${window.ut} ${
                window.utUnit
              }`;
            }
          }
        ],
        ...window.preyConfig
      })
    );
  }
  updateAverageSpeed(0, 1);
  for (let i = 0; i < window.predatorConfig.startingNb; i++) {
    window.animals.push(
      new Predator({
        x: window.p5.random(0, window.size),
        y: window.p5.random(0, window.size),
        genes: [
          {
            displayName: 'Vitesse',
            name: 'speed',
            value: window.p5.randomGaussian(
              window.predatorConfig.avgSpeed,
              window.predatorConfig.stdDevSpeed
            ),
            modificator: (parent1Value: number, parent2Value: number) => {
              const mean = _.mean([parent1Value, parent2Value]);
              const std = stdDev([parent1Value, parent2Value]);
              let val = window.p5.randomGaussian(mean, std);
              if (val < 0) val = 0.5;
              return val;
            },
            displayValue() {
              return `${(this.value * window.ut).toFixed(2)} ${window.ueUnit} / ${window.ut} ${
                window.utUnit
              }`;
            }
          }
        ],
        ...window.predatorConfig
      })
    );
  }
  updateAverageSpeed(1, 1);
  Logger('info', 'createAnimals')('Les animaux ont été créés');
};

export const initiateGlobalVariables = (p: p5) => {
  let config;
  let error = true;
  const specieRequiredFields = [
    'name',
    'avgSpeed',
    'stdDevSpeed',
    'avgNbOfBabies',
    'stdDevNbOfBabies',
    'intervalBetweenReproducingPeriods',
    'renderDistance',
    'longevity'
  ];
  while (error) {
    let configUrl;
    while (!configUrl)
      configUrl = prompt(
        "Indiquez l'URL de la configuration que vous voulez utiliser pour le simulateur",
        window.location.href + 'assets/simulator-config.json'
      );
    const req = new XMLHttpRequest();
    req.open('GET', configUrl, false);
    req.send(null);
    try {
      if (req.status !== 200) throw new Error();
      config = JSON.parse(req.responseText);
      const {
        prey,
        predator,
        size,
        scale,
        offsetX,
        offsetY,
        speed,
        ue,
        ueUnit,
        ut,
        utUnit,
        seed,
        plant
      } = config;
      if (
        !prey ||
        !predator ||
        !size ||
        !scale ||
        !ue ||
        !ueUnit ||
        !ut ||
        !utUnit ||
        !seed ||
        !plant ||
        offsetX === (null || undefined) ||
        offsetY === (null || undefined) ||
        speed === (null || undefined)
      )
        throw new Error();
      if (
        _.difference(specieRequiredFields, Object.keys(prey)).length !== 0 ||
        _.difference(specieRequiredFields, Object.keys(predator)).length !== 0
      )
        throw new Error();
      error = false;
    } catch {
      error = true;
    }
  }

  window.preyConfig = config.prey;
  window.predatorConfig = config.predator;
  window.enabledLoggers = [];
  window.averagePreySpeed = [];
  window.averagePredatorSpeed = [];
  window.animals = [];
  window.imgs = [];
  window.scale = config.scale;
  window.offsetX = config.offsetY;
  window.offsetY = config.offsetX;
  window.speed = config.speed;
  window.time = 0;
  window.size = config.size;
  window.ue = config.ue;
  window.ueUnit = config.ueUnit;
  window.ut = config.ut;
  window.utUnit = config.utUnit;
  window.plantConfig = config.plant;
  window.plants = [];
  p.randomSeed(config.seed);
  p.noiseSeed(config.seed);
  try {
    window.p5 = p;
    window.enableLogger = enableLogger;
    window.disableLogger = disableLogger;
    window.showAverageSpeedChart = showAverageSpeedChart;
    window.showSpeedCurve = showSpeedCurve;
    window.showChangeSpeedDialog = showChangeSpeedDialog;
    window.showStatsOfAnimal = showStatsOfAnimal;
    window.showChangeScaleDialog = showChangeScaleDialog;
    window.exportToCSV = exportToCSV;
    window.imgs.push(p.loadImage('assets/prey.png'));
    window.imgs.push(p.loadImage('assets/predator.png'));
    window.imgs.push(p.loadImage('assets/plant.png'));
    Logger('success', 'initiateGlobalVariables')("La fonction s'est déroulée sans incidents");
  } catch (err) {
    Logger('error', 'initiateGlobalVariables')(err.message);
  }
};
