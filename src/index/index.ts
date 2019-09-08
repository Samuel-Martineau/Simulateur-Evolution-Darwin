import './index.scss';
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import { getCanvasSize, showAverageSpeedChart, showChangeSpeedDialog } from './helpers';

const sketch = function(p: p5) {
  let size: number;
  let controlPanelDiv: p5.Element;
  p.windowResized = () => p.resizeCanvas(getCanvasSize(), getCanvasSize());
  p.preload = () => {
    window.showAverageSpeedChart = showAverageSpeedChart;
    window.showChangeSpeedDialog = showChangeSpeedDialog;
    window.processing = p;
    window.speed = 1;
    window.time = 0;
    size = 2000;
  };
  p.setup = () => {
    p.createCanvas(getCanvasSize(), getCanvasSize());
    p.frameRate(30);
    controlPanelDiv = p.createElement('div');
    p.createButton('Voir le diagramme des vitesses moyennes')
      .addClass('button turquoise')
      .parent(controlPanelDiv)
      .mousePressed(window.showAverageSpeedChart);
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
  };
  p.draw = () => {
    // Clearing the canvas
    p.background(0);
    // Resizing the canvas proportionnaly
    p.scale(getCanvasSize() / size);
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
    // Calculation of evolution
    for (let i = 0; i < window.speed; i++) {
      window.time++;
    }
    // Drawing the elements
  };
};

new p5(sketch);
