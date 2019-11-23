import Swal from 'sweetalert2';
import Chart from 'chart.js';
import * as _ from 'lodash';
import Animal from './animal/animal.class';
import { ExportToCsv } from 'export-to-csv';
// @ts-ignore
import randomColor from 'random-color';
import Logger from './logger.class';
import Plant from './plant.class';

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

export const showAverageSpeedChart = () => {
  const speed = window.speed;
  window.isPopupActive = true;
  window.speed = 0;
  const preyData = window.averagePreySpeed;
  const predatorData = window.averagePredatorSpeed;
  const indexes = _.range(1, (preyData.length > predatorData.length ? preyData.length : predatorData.length) + 1);
  setTimeout(() => {
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
    Logger('info', 'showAverageSpeedChart')('Le diagramme a été affiché');
  }, 10);
  Logger('info', 'showAverageSpeedChart')('Le popup a été ouvert');
  Swal.fire({
    title: 'Diagramme des vitesses moyennes selon les générations',
    width: 1000,
    html: '<canvas id="averageSpeedChart"></canvas>',
    allowOutsideClick: false,
    confirmButtonText: 'Parfait !'
  }).then(() => {
    window.speed = speed;
    window.isPopupActive = false;
    Logger('info', 'showAverageSpeedChart')('Le popup a été fermé');
  });
};

export const showNbOfAnimalsByTime = () => {
  window.isPopupActive = true;
  const speed = window.speed;
  window.speed = 0;
  Logger('info', 'showNbOfAnimalsByTime')('Le popup a été ouvert');
  setTimeout(() => {
    const maxNumber = 100;
    const totalNbOfEl = window.nbOfPlantsByTime.length;
    const keep = totalNbOfEl < maxNumber ? 1 : totalNbOfEl / maxNumber;
    const nbOfPlantsByTime = _.chunk(window.nbOfPlantsByTime, keep)
      .map(arr => _.mean(arr))
      .filter(n => n !== 0);
    const nbOfPreysByTime = _.chunk(window.nbOfPreysByTime, keep)
      .map(arr => _.mean(arr))
      .filter(n => n !== 0);
    const nbOfPredatorsByTime = _.chunk(window.nbOfPredatorsByTime, keep)
      .map(arr => _.mean(arr))
      .filter(n => n !== 0);
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
    Logger('info', 'showNbOfAnimalsByTime')('Le diagramme a été affiché');
  }, 10);
  //@ts-ignore
  Swal.fire({
    title: "Nombre d'individus par espèce selon le temps",
    width: 1000,
    allowEscapeKey: false,
    allowOutsideClick: false,
    confirmButtonText: 'Parfait !',
    html: '<canvas id="nbOfAnimalsByTimeChart"></canvas>'
  }).then(() => {
    window.speed = speed;
    window.isPopupActive = false;
    Logger('info', 'showNbOfAnimalsByTime')('Le popup a été fermé');
  });
};

export const showChangeSpeedDialog = () => {
  window.isPopupActive = true;
  const speed = window.speed;
  window.speed = 0;
  Logger('info', 'showChangeSpeedDialog')('Le popup a été ouvert');
  // @ts-ignore
  Swal.fire({
    title: '<h2 style="margin-bottom: 0;">Modification de la vitesse</h2>',
    input: 'range',
    inputAttributes: {
      min: 0,
      max: 25,
      step: 1
    },
    inputValue: speed,
    width: 1000,
    allowOutsideClick: false,
    confirmButtonText: 'Parfait !'
  }).then(({ value }: { value: number }) => {
    window.speed = value;
    window.isPopupActive = false;
    Logger('info', 'showChangeSpeedDialog')('Le popup a été fermé');
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
  Logger('info', 'showStatsOfAnimal')('Le popup a été ouvert');
  Swal.fire({
    title: `<h3 style="margin-bottom: 0;">Propriétés de l'animal ${a.uid}</h3>`,
    allowOutsideClick: false,
    width: 1000,
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
    `,
    confirmButtonText: 'Parfait !'
  }).then(() => {
    window.speed = speed;
    window.isPopupActive = false;
    Logger('info', 'showStatsOfAnimal')('Le popup a été fermé');
  });
};

export const updateAverageSpeed = (specie: number, generation: number) => {
  const animals = _.filter(window.animals, ['specie', specie]);
  const averageSpeed = specie === 0 ? window.averagePreySpeed : window.averagePredatorSpeed;
  if (!averageSpeed[generation - 1]) averageSpeed[generation - 1] = 0;
  averageSpeed[generation - 1] = _.chain(animals)
    .filter(['generation', generation])
    .meanBy(a => a.getGene('speed', 0).value)
    .value();
  Logger(
    'info',
    'updateAverageSpeed'
  )(
    `La vitesse moyenne de la génération ${generation} de l\'espèce ${
      specie === 0 ? window.preyConfig.name : window.predatorConfig.name
    } a été mise à jour`
  );
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
  Logger('info', 'showChangeScaleDialog')('Le popup a été ouvert');
  //@ts-ignore
  Swal.fire({
    title: '<h2 style="margin-bottom: 0;">Modification de l\'échelle</h2>',
    input: 'range',
    inputAttributes: {
      min: 1,
      max: 10,
      step: 1
    },
    inputValue: window.scale,
    width: 1000,
    allowOutsideClick: false,
    confirmButtonText: 'Parfait !'
  }).then(({ value }: { value: number }) => {
    window.speed = speed;
    window.scale = value;
    centerZoom();
    window.isPopupActive = false;
    Logger('info', 'showChangeScaleDialog')('Le popup a été fermé');
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
      Logger('info', 'changeOffsets')('Le décalage de zoom en Y a été mis à jour');
      break;
    case 1:
      if (window.offsetY + canSee >= window.size) return;
      window.offsetY += speed / window.scale;
      Logger('info', 'changeOffsets')('Le décalage de zoom en Y a été mis à jour');
      break;
    case 2:
      if (window.offsetX <= 0) return;
      window.offsetX -= speed / window.scale;
      Logger('info', 'changeOffsets')('Le décalage de zoom en X a été mis à jour');
      break;
    case 3:
      if (window.offsetX + canSee >= window.size) return;
      window.offsetX += speed / window.scale;
      Logger('info', 'changeOffsets')('Le décalage de zoom en X a été mis à jour');
      break;
  }
};

export const centerZoom = () => {
  const canSee = window.size / window.scale;
  const offset = (window.size - canSee) / 2;
  window.offsetX = offset;
  window.offsetY = offset;
  Logger('info', 'centerZoom')('Le zoom a été centré');
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
  Logger('info', 'exportToCSV')('Le fichier a été téléchargé');
};

export const enableLogger = (loggerName: string) => {
  window.enabledLoggers.push(loggerName);
  Logger('info', 'enableLogger')(`Le logger ${loggerName} est activé`);
};

export const disableLogger = (loggerName: string) => {
  if (loggerName === '*') window.enabledLoggers = [];
  else {
    const i = window.enabledLoggers.indexOf(loggerName);
    if (i === -1) return Logger('warning', 'disableLogger')(`Le logger ${loggerName} n'est pas activé`);
    window.enabledLoggers.splice(i, 1);
  }
  Logger('success', 'disableLogger')(`Le logger ${loggerName} est désactivé`);
};

export const createPlant = () => {
  const { random } = window.p5;
  const { size } = window;
  window.plants.push(new Plant(random(size), random(size)));
};
