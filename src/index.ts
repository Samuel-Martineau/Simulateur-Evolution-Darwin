import './index.scss';
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import { getCanvasSize, showStatsOfAnimal, changeOffsets, centerZoom } from './helpers';
import { createDomElements, createAnimals, initiateGlobalVariables } from './setup';
import Logger from './logger.class';

const sketch = (p: p5) => {
  let controlPanelDiv: p5.Element;
  p.windowResized = () => {
    Logger('info', 'windowResized')('La fenêtre a changé de dimensions');
    p.resizeCanvas(getCanvasSize(), getCanvasSize());
  };
  p.mouseClicked = () => {
    const info = Logger('info', 'mouseClicked');
    const error = Logger('error', 'mouseClicked');
    info('Click !');
    if (window.isPopupActive) return error('Un popup est activé');
    for (let animal of window.animals) {
      if (animal.isClicked(p.mouseX, p.mouseY)) {
        info(`L'animal ${animal.uid} a été clické`);
        showStatsOfAnimal(animal);
        break;
      }
    }
  };
  p.preload = () => initiateGlobalVariables(p);
  p.setup = () => {
    p.createCanvas(getCanvasSize(), getCanvasSize());
    p.imageMode('center');
    p.frameRate(30);
    controlPanelDiv = window.p5.createElement('div');
    createDomElements(controlPanelDiv);
    createAnimals();
    centerZoom();
  };
  p.draw = () => {
    // Effaçure du contenu du canvas
    p.background(0);
    // Affichage du nombre d'infos utiles
    const nbOfPreys = window.animals.filter((a) => a.specie === 0).length;
    const nbOfPredators = window.animals.length - nbOfPreys;
    p.fill(255);
    p.textSize(12);
    p.textAlign('left');
    p.text(
      `${Math.trunc(p.frameRate())}fps ${window.time}ut ${window.size}ut ${nbOfPreys} ${
        window.preyConfig.name
      }${nbOfPreys > 1 ? 's' : ''} ${nbOfPredators} ${window.predatorConfig.name}${
        nbOfPredators > 1 ? 's' : ''
      }`,
      10,
      20
    );
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
    if (p.mouseIsPressed && !window.isPopupActive) changeOffsets();
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
