const csvFilePath = require('path').join(__dirname, 'data.csv');
const exec = require('child_process').exec;
const puppeteer = require('puppeteer');
const ora = require('ora');
const fs = require('fs');
require('colors');

const headers = [
  'time',
  'plant:startingNb',
  'plant:reproductionSpeed',
  'predator:avgSpeed',
  'predator:stdDevSpeed',
  'predator:avgNbOfBabies',
  'predator:stdDevNbOfBabies',
  'predator:intervalBetweenReproducingPeriods',
  'predator:renderDistance',
  'predator:longevity',
  'predator:nbOfPreysToEat',
  'predator:eatingInterval',
  'predator:startingNb',
  'prey:avgSpeed',
  'prey:stdDevSpeed',
  'prey:avgNbOfBabies',
  'prey:stdDevNbOfBabies',
  'prey:intervalBetweenReproducingPeriods',
  'prey:renderDistance',
  'prey:longevity',
  'prey:nbOfPlantsToEat',
  'prey:eatingInterval',
  'prey:startingNb'
];

exec(`cd '${__dirname}/client' && npm run start`);

fs.writeFileSync(csvFilePath, convertToCsv(headers));

let i = 0;

let colors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'];
let j = 0;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.waitFor(5000);

  let spinner;

  await page.exposeFunction('frame', (time, nbOfPlants, nbOfPredators, nbOfPreys) => {
    spinner.text = `${time} ut : ${nbOfPlants} 🌿  ${nbOfPredators} 🦊  ${nbOfPreys} 🐰`;
    spinner.color = colors[j / 3];
    j++;
    if (j / 3 >= colors.length) j = 0;
  });

  await page.exposeFunction('done', (time, plantConfig, predatorConfig, preyConfig) => {
    const date = new Date();
    const message =
      `${('0' + date.getHours()).slice(-2)}h${('0' + date.getMinutes()).slice(-2)}`.white.bold +
      ' - ' +
      `${++i}`.yellow.bold +
      ` configuration${i > 1 ? 's ont' : ' a'} été générée${i > 1 ? 's' : ''}`;
    if (time < 100000) spinner.fail(message);
    else spinner.succeed(message);

    const data = [
      time,
      plantConfig.startingNb,
      plantConfig.reproductionSpeed,

      predatorConfig.avgSpeed,
      predatorConfig.stdDevSpeed,
      predatorConfig.avgNbOfBabies,
      predatorConfig.stdDevNbOfBabies,
      predatorConfig.intervalBetweenReproducingPeriods,
      predatorConfig.renderDistance,
      predatorConfig.longevity,
      predatorConfig.nbOfPreysToEat,
      predatorConfig.eatingInterval,
      predatorConfig.startingNb,

      preyConfig.avgSpeed,
      preyConfig.stdDevSpeed,
      preyConfig.avgNbOfBabies,
      preyConfig.stdDevNbOfBabies,
      preyConfig.intervalBetweenReproducingPeriods,
      preyConfig.renderDistance,
      preyConfig.longevity,
      preyConfig.nbOfPlantsToEat,
      preyConfig.eatingInterval,
      preyConfig.startingNb
    ];
    fs.appendFileSync(csvFilePath, '\n' + convertToCsv(data));
    spinner = ora().start();
  });

  await page.goto('http://0.0.0.0:8080/');

  console.log('Début de la génération de configurations'.blue.bold);

  spinner = ora().start();
})();

function convertToCsv(array) {
  return array.map((el) => `"${el}"`).join(',');
}
