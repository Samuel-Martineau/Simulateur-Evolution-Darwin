import Swal from 'sweetalert2';
import Chart from 'chart.js';
import * as _ from 'lodash';
import ChartData from './chart-data.interface';

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
  // Generating fake data
  let t = 0;
  const data: ChartData = {
    indexes: _.range(0, 1000),
    foxData: new Array(1000).fill(0).map(() => {
      t += 0.01;
      return window.processing.noise(t) * 250;
    }),
    hareData: new Array(1000).fill(0).map(() => {
      t += 0.01;
      return window.processing.noise(t) * 250;
    })
  };
  const dataToDisplay: ChartData = {
    indexes: data.indexes.filter((val) => val % Math.floor(data.indexes.length / 100) === 0),
    get hareData() {
      return data.hareData.filter((val) => this.indexes.includes(data.hareData.indexOf(val)));
    },
    get foxData() {
      return data.foxData.filter((val) => this.indexes.includes(data.foxData.indexOf(val)));
    }
  };
  const speed = window.speed;
  window.speed = 0;
  setTimeout(() => {
    new Chart(<HTMLCanvasElement>document.getElementById('averageSpeedChart'), {
      type: 'line',
      data: {
        labels: dataToDisplay.indexes.map((el) => el.toString()),
        datasets: [
          {
            label: 'Lièvres',
            data: dataToDisplay.hareData,
            borderColor: '#27ae60',
            backgroundColor: '#2ecc71',
            fill: false
          },
          {
            label: 'Renards',
            data: dataToDisplay.foxData,
            borderColor: '#d35400',
            backgroundColor: '#e67e22',
            fill: false
          }
        ]
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
