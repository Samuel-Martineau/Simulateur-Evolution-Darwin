import p5 from 'p5';
import {
  enableLogger,
  disableLogger,
  updateAverageSpeed,
  showAverageSpeedChart,
  showNbOfAnimalsByTime,
  showChangeSpeedDialog,
  showStatsOfAnimal,
  showChangeScaleDialog,
  exportToCSV
} from './helpers';
import Predator from './animal/predator.class';
import Prey from './animal/prey.class';
import _ from 'lodash';
import Logger from './logger.class';
import Gene from './animal/gene.interface';

export const createDomElements = (controlPanelDiv: p5.Element) => {
  window.p5
    .createButton('Voir le diagramme des vitesses moyennes selon les générations')
    .addClass('bouton turquoise')
    .parent(controlPanelDiv)
    .mousePressed(window.showAverageSpeedChart);
  window.p5
    .createButton("Voir le nombre d'individus selon le temps")
    .addClass('bouton bleu')
    .parent(controlPanelDiv)
    .mousePressed(window.showNbOfAnimalsByTime);
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
      () => (location.href = 'https://docs.google.com/document/d/1-0XiVGQqNu3fPAFKN3vtxdBR2Abm4OA3ouX9kTg74Gk')
    );
  Logger('info', 'createDomElements')('Les éléments du DOM ont été créés');
};

export const createAnimals = () => {
  for (let i = 0; i < window.preyConfig.startingNb; i++) {
    const { genes } = window.preyConfig;
    const gs: Gene[] = [];
    genes.forEach((g: any) => {
      const modificator: Gene['modificator'] = g.modificator;
      let value = 0;
      switch (modificator) {
        case 'constant':
          value = g.value;
          break;
        case 'average':
          value = g.avg;
          break;
        case 'stddev':
          value = window.p5.randomGaussian(g.avg, g.stdDev);
          if (value < 0) value = 0;
          break;
      }
      gs.push({
        displayName: g.displayName,
        name: g.name,
        value,
        modificator,
        displayValue() {
          return eval(g.displayValue);
        }
      });
    });
    window.animals.push(
      new Prey({
        x: window.p5.random(0, window.size),
        y: window.p5.random(0, window.size),
        genes: gs
      })
    );
  }
  updateAverageSpeed(0, 1);
  for (let i = 0; i < window.predatorConfig.startingNb; i++) {
    const { genes } = window.predatorConfig;
    const gs: Gene[] = [];
    genes.forEach((g: any) => {
      const modificator: Gene['modificator'] = g.modificator;
      let value = 0;
      switch (modificator) {
        case 'constant':
          value = g.value;
          break;
        case 'average':
          value = g.avg;
          break;
        case 'stddev':
          value = window.p5.randomGaussian(g.avg, g.stdDev);
          break;
      }
      gs.push({
        displayName: g.displayName,
        name: g.name,
        value,
        modificator,
        displayValue() {
          return eval(g.displayValue);
        }
      });
    });
    window.animals.push(
      new Predator({
        x: window.p5.random(0, window.size),
        y: window.p5.random(0, window.size),
        genes: gs
      })
    );
  }
  updateAverageSpeed(1, 1);
  Logger('info', 'createAnimals')('Les animaux ont été créés');
};

export const initiateGlobalVariables = (p: p5) => {
  let config;
  let error = true;
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
  window.nbOfAnimalsSnapshotInterval = config.nbOfAnimalsSnapshotInterval;
  window.nbOfPlantsByTime = [];
  window.nbOfPreysByTime = [];
  window.nbOfPredatorsByTime = [];
  p.randomSeed(config.seed);
  p.noiseSeed(config.seed);
  try {
    window.p5 = p;
    window.enableLogger = enableLogger;
    window.disableLogger = disableLogger;
    window.showAverageSpeedChart = showAverageSpeedChart;
    window.showNbOfAnimalsByTime = showNbOfAnimalsByTime;
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
