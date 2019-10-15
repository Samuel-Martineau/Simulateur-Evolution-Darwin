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
import Hare from './animal/hare.class';
import _ from 'lodash';
import Fox from './animal/fox.class';
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
  for (let i = 0; i < 5; i++) {
    window.animals.push(
      new Hare({
        x: 100 * (i + 1),
        y: 100 * (i + 1),
        genes: [
          {
            displayName: 'Vitesse',
            name: 'speed',
            value: window.p5.randomGaussian(4.5, 1),
            modificator: (parent1Value: number, parent2Value) => {
              const mean = _.mean([parent1Value, parent2Value]);
              const std = stdDev([parent1Value, parent2Value]);
              let val = window.p5.randomGaussian(mean, std);
              if (val < 0) val = 0.5;
              return val;
            }
          }
        ]
      })
    );
  }
  updateAverageSpeed(0, 1);
  for (let i = 0; i < 5; i++) {
    window.animals.push(
      new Fox({
        x: 150 * (i + 1),
        y: 75 * (i + 1),
        genes: [
          {
            displayName: 'Vitesse',
            name: 'speed',
            value: window.p5.random(5, 7),
            modificator: (parent1Value: number, parent2Value) => {
              const mean = _.mean([parent1Value, parent2Value]);
              const std = stdDev([parent1Value, parent2Value]);
              let val = window.p5.randomGaussian(mean, std);
              if (val < 0) val = 0.5;
              return val;
            }
          }
        ]
      })
    );
  }
  updateAverageSpeed(1, 1);
  Logger('info', 'createAnimals')('Les animaux ont été créés');
};

export const initiateGlobalVariables = (p: p5) => {
  window.enabledLoggers = [];
  window.averageHareSpeed = [];
  window.averageFoxSpeed = [];
  window.animals = [];
  window.imgs = [];
  window.scale = 1;
  window.offsetX = 0;
  window.offsetY = 0;
  window.speed = 1;
  window.time = 0;
  window.size = 4000;
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
    window.imgs.push(p.loadImage('assets/hare.png'));
    window.imgs.push(p.loadImage('assets/fox.png'));
    Logger('success', 'initiateGlobalVariables')("La fonction s'est déroulée sans incidents");
  } catch (err) {
    Logger('error', 'initiateGlobalVariables')(err.message);
  }
};
