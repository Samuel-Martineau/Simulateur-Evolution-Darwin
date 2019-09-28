import './index.scss';
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import {
  getCanvasSize,
  showAverageSpeedChart,
  showChangeSpeedDialog,
  showSpeedCurve,
  showStatsOfAnimal,
  stdDev,
  updateAverageSpeed,
  changeOffsets
} from './helpers';
import Fox from './animal/fox.class';
import Hare from './animal/hare.class';
import _ from 'lodash';
import { showChangeScaleDialog, centerZoom, exportToCSV } from './helpers';

const sketch = function(p: p5) {
  let controlPanelDiv: p5.Element;
  p.windowResized = () => p.resizeCanvas(getCanvasSize(), getCanvasSize());
  p.mouseClicked = () => {
    if (window.speed < 1) return;
    for (let animal of window.animals) {
      if (animal.isClicked(p.mouseX, p.mouseY)) {
        showStatsOfAnimal(animal);
        break;
      }
    }
  };
  p.preload = () => {
    window.showAverageSpeedChart = showAverageSpeedChart;
    window.showSpeedCurve = showSpeedCurve;
    window.showChangeSpeedDialog = showChangeSpeedDialog;
    window.showStatsOfAnimal = showStatsOfAnimal;
    window.showChangeScaleDialog = showChangeScaleDialog;
    window.exportToCSV = exportToCSV;
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
    window.imgs.push(p.loadImage('assets/background.jpg'));
    window.imgs.push(p.loadImage('assets/hare.png'));
    window.imgs.push(p.loadImage('assets/fox.png'));
    window.p5 = p;
  };
  p.setup = () => {
    p.createCanvas(getCanvasSize(), getCanvasSize());
    p.imageMode('center');
    p.frameRate(30);
    // Création des éléments du DOM
    controlPanelDiv = p.createElement('div');
    p.createButton('Voir le diagramme des vitesses moyennes selon les générations')
      .addClass('bouton turquoise')
      .parent(controlPanelDiv)
      .mousePressed(window.showAverageSpeedChart);
    p.createButton("Voir la courbe du nombre d'individus selon leur vitesse")
      .addClass('bouton bleu')
      .parent(controlPanelDiv)
      .mousePressed(window.showSpeedCurve);
    p.createButton('Changer la vitesse')
      .addClass('bouton mauve')
      .parent(controlPanelDiv)
      .mousePressed(window.showChangeSpeedDialog);
    p.createButton("Changer l'échelle")
      .addClass('bouton bleu')
      .parent(controlPanelDiv);
    p.createButton('Exporter les données en CSV')
      .addClass('bouton rouge')
      .parent(controlPanelDiv)
      .mousePressed(window.exportToCSV);
    p.createButton('Voir le travail de recherche')
      .addClass('bouton orange')
      .parent(controlPanelDiv)
      .mousePressed(
        () => (location.href = 'https://smartineau.me/simulateur-evolution-darwin/recherche')
      );
    // Création des animaux
    for (let i = 0; i < 5; i++) {
      window.animals.push(
        new Hare({
          x: 100 * (i + 1),
          y: 100 * (i + 1),
          genes: [
            {
              displayName: 'Vitesse',
              name: 'speed',
              value: p.randomGaussian(4.5, 1),
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
    for (let i = 0; i < 5; i++) {
      window.animals.push(
        new Fox({
          x: 75 * (i + 1),
          y: 75 * (i + 1),
          genes: [
            {
              displayName: 'Vitesse',
              name: 'speed',
              value: p.random(3, 5),
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
    updateAverageSpeed(2, 1);
    centerZoom();
  };
  p.draw = () => {
    // Effacement du contenu du canvas
    p.background(0);
    // Affichage du nombre de FPS
    p.fill(255);
    p.textSize(12);
    p.text(Math.trunc(p.frameRate()), 10, 20);
    // Affichage des flèches de déplacement
    p.textAlign('center');
    p.textSize(30);
    const canSee = window.size / window.scale;
    if (window.offsetY > 0) p.text('⬆️', getCanvasSize() / 2, 40);
    if (window.offsetX > 0) p.text('⬅️', 30, getCanvasSize() / 2);
    if (window.offsetX + canSee < window.size)
      p.text('➡️', getCanvasSize() - 40, getCanvasSize() / 2);
    if (window.offsetY + canSee < window.size)
      p.text('⬇️', getCanvasSize() / 2, getCanvasSize() - 10);
    if (p.mouseIsPressed && window.speed > 0) changeOffsets();
    // Redimensionnement proportionnel du canvas
    p.scale((getCanvasSize() / window.size) * window.scale);
    if (window.innerHeight <= getCanvasSize()) {
      //@ts-ignore
      p.select('body').style('overflow-y', 'hidden');
      controlPanelDiv.style('float', 'right');
      controlPanelDiv.style('height', '100vh');
      controlPanelDiv.style('overflow-y', 'scroll');
      controlPanelDiv.style('width', `${window.innerWidth - getCanvasSize()}px`);
    } else {
      //@ts-ignore
      p.select('body').style('overflow-y', 'visible');
      controlPanelDiv.style('float', 'left');
      controlPanelDiv.style('height', 'initial');
      controlPanelDiv.style('overflow-y', 'initial');
      controlPanelDiv.style('width', `100%`);
    }
    // Calcul de l'évolution
    for (let i = 0; i < window.speed; i++) {
      window.animals.forEach((animal) => animal.update());
      window.time++;
    }
    // Affichage des animaux
    window.animals
      .filter(
        (animal) =>
          animal.position.x < canSee + window.offsetX &&
          animal.position.x > window.offsetX &&
          animal.position.y < canSee + window.offsetY &&
          animal.position.y > window.offsetY
      )
      .forEach((animal) => animal.display());
  };
};

new p5(sketch);
