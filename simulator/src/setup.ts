import p5 from 'p5';
import { enableLogger, disableLogger, updateAverageGenes, createAnimal } from './helpers';
import _ from 'lodash';

export const createDomElements = (controlPanelDiv: p5.Element) => {
  window.p5
    .createButton("Voir le diagramme de l'évolution moyenne d'un gène selon les générations")
    .addClass('bouton mauve')
    .parent(controlPanelDiv)
    .mousePressed(() => window.showAverageGenesChart());
  window.p5
    .createButton("Voir le nombre d'individus selon le temps")
    .addClass('bouton rouge')
    .parent(controlPanelDiv)
    .mousePressed(() => window.showNbOfAnimalsByTime());
  window.p5
    .createButton('Changer la vitesse')
    .addClass('bouton turquoise')
    .parent(controlPanelDiv)
    .mousePressed(() => window.showChangeSpeedDialog());
  window.p5
    .createButton("Changer l'échelle")
    .addClass('bouton vert')
    .parent(controlPanelDiv)
    .mousePressed(() => window.showChangeScaleDialog());
  window.p5
    .createButton('Ajouter des animaux ou des plantes')
    .addClass('bouton bleu')
    .parent(controlPanelDiv)
    .mousePressed(() => window.showSpawn());
  window.p5
    .createButton('Retirer des animaux ou des plantes')
    .addClass('bouton noir')
    .parent(controlPanelDiv)
    .mousePressed(() => window.showKill());
  window.p5
    .createButton('Exporter les données en CSV')
    .addClass('bouton orange')
    .parent(controlPanelDiv)
    .mousePressed(() => window.exportToCSV());
  window.p5
    .createButton('Voir le travail de recherche')
    .addClass('bouton jaune')
    .parent(controlPanelDiv)
    .mousePressed(
      () => (location.href = 'https://docs.google.com/document/d/1-0XiVGQqNu3fPAFKN3vtxdBR2Abm4OA3ouX9kTg74Gk')
    );
};

export const createAnimals = () => {
  for (let i = 0; i < window.preyConfig.startingNb; i++) {
    const { genes } = window.preyConfig;
    createAnimal(0, genes, [window.p5.random(0, window.size), window.p5.random(0, window.size)]);
  }
  updateAverageGenes(0, 1);
  for (let i = 0; i < window.predatorConfig.startingNb; i++) {
    const { genes } = window.predatorConfig;
    createAnimal(1, genes, [window.p5.random(0, window.size), window.p5.random(0, window.size)]);
  }
  updateAverageGenes(1, 1);
};

export const initiateGlobalVariables = () => {
  let config = window.config;
  window.preyConfig = config.prey;
  window.predatorConfig = config.predator;
  window.enabledLoggers = [];
  window.averagePreyGenes = [];
  window.averagePredatorGenes = [];
  window.animals = [];
  window.scale = config.scale;
  window.offsetX = config.offsetY;
  window.offsetY = config.offsetX;
  window.speed = config.speed;
  window.time = 0;
  window.size = config.size;
  window.plantConfig = config.plant;
  window.plants = [];
  window.nbOfAnimalsSnapshotInterval = config.nbOfAnimalsSnapshotInterval;
  window.nbOfPlantsByTime = [];
  window.nbOfPreysByTime = [];
  window.nbOfPredatorsByTime = [];
  window.p5.randomSeed(config.seed);
  window.p5.noiseSeed(config.seed);
  window.enableLogger = enableLogger;
  window.disableLogger = disableLogger;
};
