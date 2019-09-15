import './index.scss';
import p5 from 'p5';
import 'p5/lib/addons/p5.dom';
import {
    getCanvasSize,
    showAverageSpeedChart,
    showChangeSpeedDialog,
    showSpeedCurve,
    stdDev,
    updateAverageSpeed
} from './helpers';
import Fox from './animal/fox.class';
import Hare from './animal/hare.class';
import _ from 'lodash';

const sketch = function (p: p5) {
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
        // Effacement du contenu du canvas
        p.background(0);
        // Redimensionnement proportionnel du canvas
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
        // Affichage du nombre de FPS
        p.fill(255);
        p.textSize(12);
        p.text(Math.trunc(p.frameRate()), window.size - 25, 20);
        // Calcul de l'évolution
        for (let i = 0; i < window.speed; i++) {
            window.animals.forEach((animal) => animal.update());
            window.time++;
        }
        // Affichage des animaux
        window.animals.forEach((animal) => animal.display());
    };
};

new p5(sketch);
