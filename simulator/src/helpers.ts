import Swal from 'sweetalert2';
import Chart from 'chart.js';
import * as _ from 'lodash';
import Animal from './animal/animal.class';
import { ExportToCsv } from 'export-to-csv';
// @ts-ignore
import randomColor from 'random-color';
import Plant from './plant.class';
import Prey from './animal/prey.class';
import Predator from './animal/predator.class';
import Gene from 'animal/gene.interface';

const defaultAlert = Swal.mixin({
  cancelButtonText: '❌',
  showCancelButton: true,
  confirmButtonText: '👍'
});

export const getCanvasSize = () => {
  return window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
};

export const stdDev = (arr: any[], map?: (el: any) => any) => {
  if (map) arr = arr.map(map);
  let avg = _.mean(arr);
  return _.chain(arr)
    .map(val => Math.abs(val - avg))
    .mean()
    .value();
};

export const showAverageGenesChart = () => {
  const speed = window.speed;
  window.isPopupActive = true;
  window.speed = 0;

  const genes: any[] = <any[]>_.intersectionBy(window.preyConfig.genes, window.predatorConfig.genes, 'name');
  const options: any = {};
  genes.forEach(g => (options[g.name] = g.displayName));
  //@ts-ignore
  defaultAlert
    .mixin()
    .fire({
      title: '<span style="margin-top: 20px;">De quel gêne voulez-vous voir l\'évolution?</span>',
      width: 1000,
      confirmButtonText: "Voir l'évolution du gêne",
      inputOptions: options,
      input: 'select',
      inputPlaceholder: 'Choisissez un gêne',
      inputValidator(v) {
        if (!v) return 'Veuillez choisir un gêne!';
        else return;
      }
    })
    //@ts-ignore
    .then(({ value: gene, dismiss: reason }) => {
      if (reason) {
        window.speed = speed;
        window.isPopupActive = false;
        return;
      }
      //@ts-ignore
      const preyData = window.averagePreyGenes.map(a => a[gene]);
      //@ts-ignore
      const predatorData = window.averagePredatorGenes.map(a => a[gene]);
      const indexes = _.range(1, (preyData.length > predatorData.length ? preyData.length : predatorData.length) + 1);
      defaultAlert
        .fire({
          title: '<span style="margin-top: 20px;">Diagramme des vitesses moyennes selon les générations</span>',
          width: 1000,
          html: '<canvas id="averageSpeedChart"></canvas>',
          showCancelButton: false,
          onOpen() {
            new Chart(<HTMLCanvasElement>document.getElementById('averageSpeedChart'), {
              type: 'line',
              data: {
                labels: indexes.map(el => el.toString()),
                datasets: [
                  {
                    label: `${window.preyConfig.name}s`,
                    data: preyData,
                    borderColor: '#5DBCD2',
                    backgroundColor: '#3f9faa',
                    fill: false
                  },
                  {
                    label: `${window.predatorConfig.name}s`,
                    data: predatorData,
                    borderColor: '#EC0000',
                    backgroundColor: '#ce0000',
                    fill: false
                  }
                ]
              },
              options: {
                scales: {
                  yAxes: [{ scaleLabel: { display: true, labelString: 'Vitesse moyenne' } }],
                  xAxes: [{ scaleLabel: { display: true, labelString: 'Nombre de générations' } }]
                },
                elements: {
                  line: {
                    tension: 0
                  }
                }
              }
            });
          }
        })
        .then(() => {
          window.speed = speed;
          window.isPopupActive = false;
        });
    });
};

export const showNbOfAnimalsByTime = () => {
  window.isPopupActive = true;
  const speed = window.speed;
  window.speed = 0;
  //@ts-ignore
  defaultAlert
    .fire({
      title: '<span style="margin-top: 20px;">Nombre d\'individus par espèce selon le temps</span>',
      width: 1000,
      showCancelButton: false,
      html: '<canvas id="nbOfAnimalsByTimeChart"></canvas>',
      onOpen() {
        const maxNumber = 100;
        const totalNbOfEl = window.nbOfPlantsByTime.length;
        const keep = totalNbOfEl < maxNumber ? 1 : totalNbOfEl / maxNumber;
        const nbOfPlantsByTime = _.chunk(window.nbOfPlantsByTime, keep).map(arr => _.mean(arr));
        const nbOfPreysByTime = _.chunk(window.nbOfPreysByTime, keep).map(arr => _.mean(arr));
        const nbOfPredatorsByTime = _.chunk(window.nbOfPredatorsByTime, keep).map(arr => _.mean(arr));
        const labels = _.chunk(_.range(0, totalNbOfEl), keep).map(arr =>
          (_.mean(arr) * window.nbOfAnimalsSnapshotInterval).toString()
        );
        const datasets = [
          {
            label: `${window.preyConfig.name}s`,
            data: nbOfPreysByTime,
            borderColor: '#5DBCD2',
            backgroundColor: '#3f9faa',
            fill: false
          },
          {
            label: `${window.predatorConfig.name}s`,
            data: nbOfPredatorsByTime,
            borderColor: '#EC0000',
            backgroundColor: '#ce0000',
            fill: false
          },
          {
            label: `Plantes`,
            data: nbOfPlantsByTime,
            borderColor: '#3ABB44',
            backgroundColor: '#1c9d27',
            fill: false
          }
        ].filter(d => d.data.length > 0);
        new Chart(<HTMLCanvasElement>document.getElementById('nbOfAnimalsByTimeChart'), {
          type: 'line',
          data: {
            labels,
            datasets
          },
          options: {
            scales: {
              yAxes: [{ scaleLabel: { display: true, labelString: "Nombre d'individus" } }],
              xAxes: [{ scaleLabel: { display: true, labelString: 'Temps (ut)' } }]
            },
            elements: {
              line: {
                tension: 0.4
              }
            }
          }
        });
      }
    })
    .then(() => {
      window.speed = speed;
      window.isPopupActive = false;
    });
};

export const showChangeSpeedDialog = () => {
  window.isPopupActive = true;
  const speed = window.speed;
  window.speed = 0;
  defaultAlert
    .fire(
      //@ts-ignore
      {
        title: '<span style="margin-top: 20px;">Modification de la vitesse</span>',
        input: 'range',
        inputAttributes: {
          min: 0,
          max: 25,
          step: 1
        },
        inputValue: speed,
        width: 1000
      }
    )
    .then(({ value, dismiss: reason }: any) => {
      window.isPopupActive = false;
      if (reason) return (window.speed = speed);
      window.speed = value;
    });
};

export const showStatsOfAnimal = (a: Animal) => {
  window.isPopupActive = true;
  const speed = window.speed;
  window.speed = 0;
  let genesText = '';
  a.genes.forEach(gene => {
    let adjustmentsText = '';
    const keys = Object.keys(gene.adjustments);
    if (keys.length > 0) {
      adjustmentsText += `<ul><ul>`;
      keys.forEach(k => {
        const g = a.getGene(k, 0);
        const value = g.value;
        const name = g.displayName;
        const res = eval(eval('`' + gene.adjustments[k] + '`'));
        adjustmentsText += `<li style="font-size: 22px;">Ajustement de <u>${res}</u> par le gêne « <b>${name}</b> »</li>`;
      });
      adjustmentsText += '</ul></ul>';
    }
    genesText += `<li><b>${
      gene.displayName
    }: </b>${gene.displayValue()} <small style="font-size: 15px; color: gray; vertical-align: middle;">Type: « ${
      gene.modificator
    } »</small></i>${adjustmentsText}</li>`;
  });
  let eventsText = '';
  a.events.forEach(event => {
    const time = event.time - window.time;
    const regex = /%/g;
    let name = event.name;
    let i = 0;
    let array;
    //@ts-ignore
    while ((array = regex.exec(name)) !== null) name = name.replace('%', event.data[i](a));
    eventsText += `<li><b>${name} </b> dans <u>${time.toFixed(2)}</u> ue => <u>${Math.round(time * window.ut)}</u> ${
      window.utUnit
    }</li>`;
  });
  defaultAlert
    .fire({
      title: `<span style="margin-top: 20px;">Propriétés de l'animal ${a.uid}</span>`,
      width: 1000,
      showCancelButton: false,
      html: `
      <div class="popup-content">
        <ul>
          <li><b>Espèce: </b>${a.specie === 0 ? window.preyConfig.name : window.predatorConfig.name}</li>
          <li><b>Position: </b>X: ${a.position.x.toFixed(2)}, Y: ${a.position.y.toFixed(2)}</li>
          <li><b>Génération: </b>${a.generation}</li>
          <li><b>Gènes: </b><ul>${genesText}</ul></li>
          <li><b>Évènements: </b><ul>${eventsText}</ul></li>
        </ul>
      </div>
    `
    })
    .then(() => {
      window.speed = speed;
      window.isPopupActive = false;
    });
};

export const updateAverageGenes = (specie: 0 | 1, generation: number) => {
  const genes: string[] = (<any[]>_.intersectionBy(window.preyConfig.genes, window.predatorConfig.genes, 'name')).map(
    g => g.name
  );
  const animals = _.chain(window.animals)
    .filter(['specie', specie])
    .filter(['generation', generation])
    .value();
  const averageGenes: any = {};
  genes.forEach(name => (averageGenes[name] = _.meanBy(animals, a => a.getRealGeneValue(name, 0))));
  const generationsAverages = specie === 0 ? window.averagePreyGenes : window.averagePredatorGenes;
  generationsAverages[generation - 1] = averageGenes;
};

export const updateNbOfAnimalsByTime = () => {
  window.nbOfPlantsByTime.push(window.plants.length);
  const nbOfPreys = window.animals.filter(a => a.specie === 0).length;
  window.nbOfPreysByTime.push(nbOfPreys);
  window.nbOfPredatorsByTime.push(window.animals.length - nbOfPreys);
};

export const showChangeScaleDialog = () => {
  window.isPopupActive = true;
  const speed = window.speed;
  window.speed = 0;
  //@ts-ignore
  defaultAlert
    .fire(
      //@ts-ignore
      {
        title: '<span style="margin-top: 20px;">Modification de l\'échelle</span>',
        input: 'range',
        inputAttributes: {
          min: 1,
          max: 10,
          step: 1
        },
        inputValue: window.scale,
        width: 1000
      }
    )
    .then(({ value, dismiss: reason }: any) => {
      window.speed = speed;
      window.isPopupActive = false;
      if (reason) return;
      window.scale = value;
      centerZoom();
    });
};

export const changeOffsets = () => {
  const arrowsCoordinates = [
    [getCanvasSize() / 2 - 20, getCanvasSize() / 2 + 20, 0, 50],
    [getCanvasSize() / 2 - 20, getCanvasSize() / 2 + 20, getCanvasSize() - 40, getCanvasSize()],
    [0, 50, getCanvasSize() / 2 - 25, getCanvasSize() / 2 + 25],
    [getCanvasSize() - 57, getCanvasSize(), getCanvasSize() / 2 - 30, getCanvasSize() / 2 + 25]
  ];
  let clickedArrow = -1;
  arrowsCoordinates.forEach((coor, index) => {
    const [minX, maxX, minY, maxY] = coor;
    if (window.p5.mouseX > minX && window.p5.mouseX < maxX && window.p5.mouseY > minY && window.p5.mouseY < maxY)
      clickedArrow = index;
  });
  const canSee = window.size / window.scale;
  const speed = 100;
  switch (clickedArrow) {
    case 0:
      if (window.offsetY <= 0) return;
      window.offsetY -= speed / window.scale;
      break;
    case 1:
      if (window.offsetY + canSee >= window.size) return;
      window.offsetY += speed / window.scale;
      break;
    case 2:
      if (window.offsetX <= 0) return;
      window.offsetX -= speed / window.scale;
      break;
    case 3:
      if (window.offsetX + canSee >= window.size) return;
      window.offsetX += speed / window.scale;
      break;
  }
};

export const centerZoom = () => {
  const canSee = window.size / window.scale;
  const offset = (window.size - canSee) / 2;
  window.offsetX = offset;
  window.offsetY = offset;
};

export const exportToCSV = () => {
  const allGenes: any[] = [];
  const allEvents: any[] = [];
  window.animals.forEach(animal => {
    animal.genes.forEach(gene => (_.findIndex(allGenes, ['name', gene.name]) === -1 ? allGenes.push(gene) : null));
    animal.events.forEach(event =>
      _.findIndex(allEvents, ['name', event.name]) === -1 ? allEvents.push(event) : null
    );
  });
  const data: any[] = window.animals.map(animal => {
    animal = animal.clone();
    let { uid, canReproduce, events, intervalBetweenReproducingPeriods, genes, specie, position, generation } = animal;
    const { x, y } = position;
    allGenes.forEach(gene =>
      _.findIndex(genes, ['name', gene.name]) === -1 ? genes.push(animal.getGene(gene.name, undefined)) : null
    );
    allEvents.forEach(event =>
      _.findIndex(events, ['name', event.name]) === -1
        ? events.push({ name: event.name, time: -1, action: () => null })
        : null
    );
    const genesObj: any = {};
    genes.forEach(gene => (genesObj[`gene:${gene.displayName}`] = gene.value));
    const eventsObj: any = {};
    events.forEach(event => (eventsObj[`event:${event.name}`] = `${event.time}`));
    specie = specie === 0 ? window.preyConfig.name : window.predatorConfig.name;
    return {
      uid,
      specie,
      x,
      y,
      generation,
      canReproduce,
      intervalBetweenReproducingPeriods,
      ...eventsObj,
      ...genesObj
    };
  });

  const options = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    filename: `DONNEES_ANIMAUX_${new Date().toString().toUpperCase()}`,
    useBom: true,
    useKeysAsHeaders: true
  };

  const csvExporter = new ExportToCsv(options);

  csvExporter.generateCsv(data);
};

export const enableLogger = (loggerName: string) => {
  window.enabledLoggers.push(loggerName);
};

export const disableLogger = (loggerName: string) => {
  if (loggerName === '*') window.enabledLoggers = [];
  else {
    const i = window.enabledLoggers.indexOf(loggerName);
    if (i === -1) return;
    window.enabledLoggers.splice(i, 1);
  }
};

export const createPlant = () => {
  const { random } = window.p5;
  const { size } = window;
  window.plants.push(new Plant(random(size), random(size)));
};

export const createAnimal = (specie: 0 | 1, genes: any, coordinates: [number, number]) => {
  const gs: Gene[] = [];
  genes.forEach((g: any) => {
    const modificator: Gene['modificator'] = g.modificator;
    let value = 0;
    switch (modificator) {
      case 'constant':
        value = g.value;
        break;
      case 'average':
        value = g.value;
        break;
      case 'stddev':
        if (g.avg && g.stdDev) value = window.p5.randomGaussian(g.avg, g.stdDev);
        else value = g.value;
        if (value < 0) value = 0;
        break;
    }
    const adjustments = g.adjustments || {};
    gs.push({
      displayName: g.displayName,
      name: g.name,
      value,
      modificator,
      displayValue() {
        return eval('`' + g.displayValue + '`');
      },
      adjustments
    });
  });
  window.animals.push(
    new (specie === 0 ? Prey : Predator)({
      x: coordinates[0],
      y: coordinates[1],
      genes: gs
    })
  );
};

export const spawnAnimals = (specie: 0 | 1, nb: number, method: 'average' | 'config') => {
  for (let i = 0; i < nb; i++) {
    const coor: [number, number] = [window.p5.random(0, window.size), window.p5.random(0, window.size)];
    if (method === 'config') {
      const { genes } = specie === 0 ? window.preyConfig : window.predatorConfig;
      createAnimal(specie, genes, coor);
    } else {
      const averages: any = _.last(specie === 0 ? window.averagePreyGenes : window.averagePredatorGenes);
      const genes = (specie === 0 ? window.preyConfig : window.predatorConfig).genes.map((g: any) => ({
        displayName: g.displayName,
        name: g.name,
        modificator: g.modificator,
        value: averages[g.name],
        displayValue: g.displayValue
      }));
      createAnimal(specie, genes, coor);
    }
  }
};

export const showSpawn = () => {
  const speed = window.speed;
  window.isPopupActive = true;
  window.speed = 0;
  defaultAlert
    .queue([
      //@ts-ignore
      {
        title: '<span style="margin-top: 20px;">Que voulez-vous faire apparaître?</span>',
        input: 'select',
        inputOptions: {
          0: window.preyConfig.name,
          1: window.predatorConfig.name,
          2: 'Plante'
        },
        inputPlaceholder: 'Choisissez une espèce',
        inputValidator(v) {
          if (!v) return 'Veuillez choisir une espèce!';
          else return;
        }
      },
      //@ts-ignore
      {
        title: 'Combien voulez-vous en faire apparaître?',
        input: 'number',
        inputValue: 1,
        inputValidator(v: number) {
          if (!v || v < 1) return 'Veuillez entrer un nombre plus grand ou égal à 1';
        }
      },
      //@ts-ignore
      {
        title: 'À partir de quelles données voulez-vous les faire apparaître?',
        input: 'select',
        inputOptions: {
          average: 'À partir de la moyenne de la génération la plus récente',
          config: 'À partir de la configuration de départ'
        },
        inputPlaceholder: 'Choisissez une des deux options',
        inputValidator(v) {
          if (!v) return 'Veuillez choisir une des deux options!';
          else return;
        }
      }
    ])
    .then(({ value: answers, dismiss: reason }: any) => {
      window.speed = speed;
      window.isPopupActive = false;
      if (reason) return;
      if (answers[0] === 2) {
        for (let i = 0; i < parseInt(answers[1]); i++) createPlant();
        return;
      }
      spawnAnimals(<0 | 1>parseInt(answers[0]), parseInt(answers[1]), answers[2]);
    });
};

export const kill = (specie: 0 | 1 | 2, nb: number) => {
  for (let i = 0; i < nb; i++) {
    if (specie === 2) {
      _.remove(window.plants, ['uid', window.p5.random(window.plants).uid]);
    } else {
      const animals = window.animals.filter(a => a.specie === specie);
      _.remove(window.animals, ['uid', window.p5.random(animals).uid]);
    }
  }
};

export const showKill = () => {
  const speed = window.speed;
  window.isPopupActive = true;
  window.speed = 0;
  const inputOptions: any = {};
  if (window.plants.length > 0) inputOptions[2] = 'Plante';
  if (window.animals.filter(a => a.specie === 1).length > 0) inputOptions[1] = window.predatorConfig.name;
  if (window.animals.filter(a => a.specie === 0).length > 0) inputOptions[0] = window.preyConfig.name;
  //@ts-ignore
  defaultAlert
    .fire({
      title: '<span style="margin-top: 20px;">Que voulez-vous retirer?</span>',
      input: 'select',
      inputOptions,
      inputPlaceholder: 'Choisissez une espèce',
      inputValidator(v) {
        if (!v) return 'Veuillez choisir une espèce!';
        else return;
      }
    })
    .then(({ value: specie, dismiss: reason }: any) => {
      if (reason) {
        window.isPopupActive = false;
        window.speed = speed;
      } else {
        specie = parseInt(specie);
        defaultAlert
          .fire(
            //@ts-ignore
            {
              title: '<span style="margin-top: 20px;">Combien voulez-vous en retirer?</span>',
              input: 'range',
              inputAttributes: {
                min: 1,
                max: specie === 2 ? window.plants.length : window.animals.filter(a => a.specie === specie).length,
                step: 1
              },
              inputValue: 1
            }
          )
          .then(({ value: nb, dismiss: reason }: any) => {
            window.isPopupActive = false;
            window.speed = speed;
            if (reason) return;
            //@ts-ignore
            kill(parseInt(specie), parseInt(nb));
          });
      }
    });
};
