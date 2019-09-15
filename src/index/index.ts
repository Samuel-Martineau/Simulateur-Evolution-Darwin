import './index.scss';
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import {
  getCanvasSize,
  showAverageSpeedChart,
  showChangeSpeedDialog,
  updateAverageSpeed,
  stdDev,
  showSpeedCurve
} from './helpers';
import Fox from './animals/fox.class';
import Hare from './animals/hare.class';
import _ from 'lodash';

const sketch = function(p: p5) {
  let controlPanelDiv: p5.Element;
  p.windowResized = () => p.resizeCanvas(getCanvasSize(), getCanvasSize());
  p.preload = () => {
    window.showAverageSpeedChart = showAverageSpeedChart;
    window.showSpeedCurve = showSpeedCurve;
    window.showChangeSpeedDialog = showChangeSpeedDialog;
    window.averageHareSpeed = [];
    window.averageFoxSpeed = [];
    window.animals = [];
    window.imgs = [];
    window.imgs.push(p.loadImage('assets/hare.png'));
    window.imgs.push(p.loadImage('assets/fox.png'));
    window.p5 = p;
    window.speed = 1;
    window.time = 0;
    window.size = 647;
  };
  p.setup = () => {
    p.createCanvas(getCanvasSize(), getCanvasSize());
    p.imageMode('center');
    p.frameRate(30);
    controlPanelDiv = p.createElement('div');
    p.createButton('Voir le diagramme des vitesses moyennes selon les générations')
      .addClass('button turquoise')
      .parent(controlPanelDiv)
      .mousePressed(window.showAverageSpeedChart);
    p.createButton("Voir la courbe du nombre d'individus selon leur vitesse")
      .addClass('button blue')
      .parent(controlPanelDiv)
      .mousePressed(window.showSpeedCurve);
    p.createButton('Changer la vitesse')
      .addClass('button purple')
      .parent(controlPanelDiv)
      .mousePressed(window.showChangeSpeedDialog);
    p.createButton('Voir le travail de recherche')
      .addClass('button orange')
      .parent(controlPanelDiv)
      .mousePressed(
        () => (location.href = 'https://smartineau.me/simulateur-evolution-darwin/recherche')
      );
    for (let i = 0; i < 5; i++) {
      window.animals.push(
        new Hare({
          x: 100 * (i + 1),
          y: 100 * (i + 1),
          genes: [
            {
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
    updateAverageSpeed(0, 0);
    for (let i = 0; i < 5; i++) {
      window.animals.push(
        new Fox({
          x: 75 * (i + 1),
          y: 75 * (i + 1),
          genes: [
            {
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
    updateAverageSpeed(1, 0);
  };
  p.draw = () => {
    // Clearing the canvas
    p.background(0);
    // Resizing the canvas proportionnaly
    p.scale(getCanvasSize() / window.size);
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
    // Frame rate
    p.fill(255);
    p.textSize(12);
    p.text(Math.trunc(p.frameRate()), window.size - 25, 20);
    // Calculation of evolution
    for (let i = 0; i < window.speed; i++) {
      window.animals.forEach((animal) => animal.update());
      window.time++;
    }
    // Drawing the elements
    window.animals.forEach((animal) => animal.display());
  };
};

new p5(sketch);
