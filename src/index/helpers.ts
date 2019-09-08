import Swal from 'sweetalert2';
import Chart from 'chart.js';
import * as _ from 'lodash';

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
  setTimeout(() => {
    new Chart(<HTMLCanvasElement>document.getElementById('averageSpeedChart'), {
      type: 'line',
      data: {
        labels: _.range(0, 100).map((el) => el.toString()),
        datasets: [
          {
            label: 'Lapins',
            data: _.range(0, 100).map((el) => Math.pow(el, 2)),
            borderColor: '#27ae60',
            backgroundColor: '#2ecc71',
            fill: false
          },
          {
            label: 'Renards',
            data: _.range(0, 100).map((el) => Math.pow(el, 2.25)),
            borderColor: '#d35400',
            backgroundColor: '#e67e22',
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        tooltips: {
          mode: 'index'
        }
      }
    });
  });
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
