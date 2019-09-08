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
    const canvas = <HTMLCanvasElement>document.getElementById('averageSpeedChart');
    const speedChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      }
    });
  });
  Swal.fire({
    title: 'Diagramme des vitesses moyennes selon le temps',
    html: `
      <canvas id="averageSpeedChart"></canvas>
    `,
    confirmButtonText: 'Parfait !'
  }).then(() => {
    window.speed = speed;
  });
};
