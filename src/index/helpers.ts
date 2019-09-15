import Swal from 'sweetalert2';
import Chart from 'chart.js';
import * as _ from 'lodash';
import Animal from './animals/animal.class';
//@ts-ignore
import randomColor from 'random-color';

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
  window.speed = 0;
  const hareData = window.averageHareSpeed.slice();
  const foxData = window.averageFoxSpeed.slice();
  const indexes = _.range(0, hareData.length > foxData.length ? hareData.length : foxData.length);
  setTimeout(() => {
    new Chart(<HTMLCanvasElement>document.getElementById('averageSpeedChart'), {
      type: 'line',
      data: {
        labels: indexes.map((el) => (el + 1).toString()),
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
  }, 10);
  Swal.fire({
    title: 'Diagramme des vitesses moyennes selon le temps',
    width: 1000,
    html: `
      <canvas id="averageSpeedChart"></canvas>
    `,
    confirmButtonText: 'Parfait !'
  }).then(() => {
    window.speed = speed;
  });
};

export const showSpeedCurve = () => {
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
      label: `Lièvres de génération ${index + 1}`,
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
      label: `Renards de génération ${index + 1}`,
      data: gen,
      backgroundColor: color,
      borderColor: color,
      fill: false
    });
  });
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
  }, 10);
  Swal.fire({
    title: "Courbe du nombre d'individus selon leur vitesse",
    width: 1000,
    html: `
    <canvas id="speedGaussianCurve"></canvas>
  `,
    confirmButtonText: 'Parfait !'
  }).then(() => {
    window.speed = speed;
  });
};

export const showChangeSpeedDialog = () => {
  const speed = window.speed;
  window.speed = 0;
  //@ts-ignore
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
    confirmButtonText: 'Parfait !'
  }).then(({ value }: { value: number }) => {
    window.speed = value;
  });
};

export const updateAverageSpeed = (specie: number, generation: number) => {
  const animals = _.filter(window.animals, ['specie', specie]);
  const averageSpeed = specie === 0 ? window.averageHareSpeed : window.averageFoxSpeed;
  if (!averageSpeed[generation]) averageSpeed[generation] = 0;
  const avg = _.chain(animals)
    .filter(['generation', generation])
    .meanBy((a) => a.getGene('speed', 0).value)
    .value();
  averageSpeed[generation] = avg;
};
