import Swal from 'sweetalert2';
import Chart from 'chart.js';
import * as _ from 'lodash';
import Animal from './animal/animal.class';
import { ExportToCsv } from 'export-to-csv';
// @ts-ignore
import randomColor from 'random-color';
import Logger from './logger.class';

export const getCanvasSize = () => {
  return window.innerHeight < window.innerWidth ? window.innerHeight : window.innerWidth;
};

export const stdDev = (arr: any[], key?: string) => {
  if (key) arr = arr.map((val) => val[key]);
  let avg = _.mean(arr);
  return _.chain(arr)
    .map((val) => Math.abs(val - avg))
    .mean()
    .value();
};

export const showAverageSpeedChart = () => {
  const speed = window.speed;
  window.isPopupActive = true;
  window.speed = 0;
  const hareData = window.averageHareSpeed.slice();
  const foxData = window.averageFoxSpeed.slice();
  const indexes = _.range(
    1,
    (hareData.length > foxData.length ? hareData.length : foxData.length) + 1
  );
  setTimeout(() => {
    new Chart(<HTMLCanvasElement>document.getElementById('averageSpeedChart'), {
      type: 'line',
      data: {
        labels: indexes.map((el) => el.toString()),
        datasets: [
          {
            label: 'Lièvres',
            data: hareData,
            borderColor: '#27ae60',
            backgroundColor: '#2ecc71',
            fill: false
          },
          {
            label: 'Renards',
            data: foxData,
            borderColor: '#d35400',
            backgroundColor: '#e67e22',
            fill: false
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{ scaleLabel: { display: true, labelString: 'Vitesse moyenne' } }],
          xAxes: [{ scaleLabel: { display: true, labelString: 'Nombre de générations' } }]
        }
      }
    });
    Logger('info', 'showAverageSpeedChart')('Le diagramme a été affiché');
  }, 10);
  Logger('info', 'showAverageSpeedChart')('Le popup a été ouvert');
  Swal.fire({
    title: 'Diagramme des vitesses moyennes selon le temps',
    width: 1000,
    html: `
      <canvas id="averageSpeedChart"></canvas>
    `,
    allowOutsideClick: false,
    confirmButtonText: 'Parfait !'
  }).then(() => {
    window.speed = speed;
    window.isPopupActive = false;
    Logger('info', 'showAverageSpeedChart')('Le popup a été ouvert');
  });
};

export const showSpeedCurve = () => {
  window.isPopupActive = true;
  const speed = window.speed;
  window.speed = 0;
  const hares = _.filter(window.animals, ['specie', 0]);
  const foxes = _.filter(window.animals, ['specie', 1]);
  let highestGen = (
    <Animal>_.maxBy(_.concat(hares, foxes), (a) => a.generation) || { generation: -1 }
  ).generation;
  let hareData: any[] = [];
  let foxData: any[] = [];
  const data: any = { fox: [], hare: [], indexes: [] };
  for (let i = 0; i < _.range(0, highestGen + 1).length; i++) {
    const haresInGen = _.filter(hares, (a) => a.generation === i);
    const foxesInGen = _.filter(foxes, (a) => a.generation === i);
    const haresSpeed = haresInGen.map((a) => a.getGene('speed', 0).value);
    const foxesSpeed = foxesInGen.map((a) => a.getGene('speed', 0).value);
    const hareChunk = _.countBy(haresSpeed, Math.floor);
    const foxChunk = _.countBy(foxesSpeed, Math.floor);
    for (let num in Object.assign({}, hareChunk, foxChunk))
      if (!data.indexes.includes(parseInt(num))) data.indexes.push(parseInt(num));
    hareData.push(hareChunk);
    foxData.push(foxChunk);
  }
  for (let gen in hareData) {
    data.hare[gen] = [];
    data.indexes.forEach((i: number) => {
      data.hare[gen].push(hareData[gen][i] || 0);
    });
  }
  for (let gen in foxData) {
    data.fox[gen] = [];
    data.indexes.forEach((i: number) => {
      data.fox[gen].push(foxData[gen][i] || 0);
    });
  }
  data.indexes = data.indexes.sort((a: number, b: number) => a - b);
  const chartData: Chart.ChartDataSets[] = [];
  data.hare.forEach((gen: number[], index: number) => {
    let t = gen.reduce((acc, curr) => acc + curr);
    if (t === 0) return;
    let color = randomColor(0.99, 0.99).hexString();
    chartData.push({
      label: `Lièvres de génération ${index}`,
      data: gen,
      backgroundColor: color,
      borderColor: color,
      fill: false
    });
  });
  data.fox.forEach((gen: number[], index: number) => {
    let t = gen.reduce((acc, curr) => acc + curr);
    if (t === 0) return;
    let color = randomColor().hexString();
    chartData.push({
      label: `Renards de génération ${index}`,
      data: gen,
      backgroundColor: color,
      borderColor: color,
      fill: false
    });
  });
  Logger('info', 'showSpeedCurve')('Les calculs ont été effectués');
  setTimeout(() => {
    new Chart(<HTMLCanvasElement>document.getElementById('speedGaussianCurve'), {
      type: 'line',
      data: {
        labels: data.indexes.map((el: number) => el.toString()),
        datasets: chartData
      },
      options: {
        scales: {
          yAxes: [{ scaleLabel: { display: true, labelString: "Nombre d'individus" } }],
          xAxes: [{ scaleLabel: { display: true, labelString: 'Vitesse' } }]
        }
      }
    });
    Logger('info', 'showSpeedCurve')('Le diagramme a été affiché');
  }, 10);
  Logger('info', 'showSpeedCurve')('Le popup a été ouvert');
  Swal.fire({
    title: "Courbe du nombre d'individus selon leur vitesse",
    width: 1000,
    html: `
      <canvas id="speedGaussianCurve"></canvas>
    `,
    allowOutsideClick: false,
    confirmButtonText: 'Parfait !'
  }).then(() => {
    window.speed = speed;
    window.isPopupActive = false;
    Logger('info', 'showSpeedCurve')('Le popup a été fermé');
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
      max: 200,
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
  a.genes.forEach((gene) => {
    genesText += `<li><b>${gene.displayName}: </b>${gene.value.toFixed(2)}</li>`;
  });
  let eventsText = '';
  a.events.forEach((event) => {
    const time = (event.time - window.time) / (30 * speed);
    eventsText += `<li><b>${event.name} </b> dans ${time.toFixed(2)}<b>s</b></li>`;
  });
  Logger('info', 'showStatsOfAnimal')('Le popup a été ouvert');
  Swal.fire({
    title: `<h3 style="margin-bottom: 0;">Propriétés de l'animal ${a.uid}</h3>`,
    allowOutsideClick: false,
    width: 1000,
    html: `
      <div style="font-size: 1.4em; display: inline-block; text-align: left;">
        <ul>
          <li><b>Espèce: </b>${a.specie === 0 ? 'lièvre' : 'renard'}</li>
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
  const averageSpeed = specie === 0 ? window.averageHareSpeed : window.averageFoxSpeed;
  if (!averageSpeed[generation - 1]) averageSpeed[generation - 1] = 0;
  averageSpeed[generation - 1] = _.chain(animals)
    .filter(['generation', generation])
    .meanBy((a) => a.getGene('speed', 0).value)
    .value();
  Logger('info', 'updateAverageSpeed')(
    `La vitesse moyenne de la génération ${generation} de l\'espèce ${specie} a été mise à jour`
  );
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
    if (
      window.p5.mouseX > minX &&
      window.p5.mouseX < maxX &&
      window.p5.mouseY > minY &&
      window.p5.mouseY < maxY
    )
      clickedArrow = index;
  });
  const canSee = window.size / window.scale;
  switch (clickedArrow) {
    case 0:
      if (window.offsetY <= 0) return;
      window.offsetY -= 20 / window.scale;
      Logger('info', 'changeOffsets')('Le décalage de zoom en Y a été mis à jour');
      break;
    case 1:
      if (window.offsetY + canSee >= window.size) return;
      window.offsetY += 20 / window.scale;
      Logger('info', 'changeOffsets')('Le décalage de zoom en Y a été mis à jour');
      break;
    case 2:
      if (window.offsetX <= 0) return;
      window.offsetX -= 20 / window.scale;
      Logger('info', 'changeOffsets')('Le décalage de zoom en X a été mis à jour');
      break;
    case 3:
      if (window.offsetX + canSee >= window.size) return;
      window.offsetX += 20 / window.scale;
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
  window.animals.forEach((animal) => {
    animal.genes.forEach((gene) =>
      _.findIndex(allGenes, ['name', gene.name]) === -1 ? allGenes.push(gene) : null
    );
    animal.events.forEach((event) =>
      _.findIndex(allEvents, ['name', event.name]) === -1 ? allEvents.push(event) : null
    );
  });
  const data: any[] = window.animals.map((animal) => {
    animal = animal.clone();
    let {
      uid,
      canReproduce,
      events,
      intervalBetweenReproducingPeriods,
      genes,
      specie,
      position,
      generation
    } = animal;
    const { x, y } = position;
    allGenes.forEach((gene) =>
      _.findIndex(genes, ['name', gene.name]) === -1
        ? genes.push(animal.getGene(gene.name, undefined))
        : null
    );
    allEvents.forEach((event) =>
      _.findIndex(events, ['name', event.name]) === -1
        ? events.push({ name: event.name, time: -1, action: () => null })
        : null
    );
    const genesObj: any = {};
    genes.forEach((gene) => (genesObj[`gene:${gene.displayName}`] = gene.value));
    const eventsObj: any = {};
    events.forEach((event) => (eventsObj[`event:${event.name}`] = `${event.time}`));
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
  const i = window.enabledLoggers.indexOf(loggerName);
  if (i === -1)
    return Logger('warning', 'disableLogger')(`Le logger ${loggerName} n'est pas activé`);
  window.enabledLoggers.slice(i, 1);
  Logger('success', 'disableLogger')(`Le logger ${loggerName} est désactivé`);
};
