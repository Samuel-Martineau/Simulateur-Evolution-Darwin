const csvFilePath = require('path').join(__dirname, 'data.csv');
const puppeteer = require('puppeteer');
const exec = require('child_process').exec;
const fs = require('fs');
const headers = [
  'time',
  'prey:avgSpeed',
  'prey:stdDevSpeed',
  'prey:avgNbOfBabies',
  'prey:stdDevNbOfBabies',
  'prey:intervalBetweenReproducingPeriods',
  'prey:renderDistance',
  'prey:longevity',
  'prey:startingNb',
  'predator:avgSpeed',
  'predator:stdDevSpeed',
  'predator:avgNbOfBabies',
  'predator:stdDevNbOfBabies',
  'predator:intervalBetweenReproducingPeriods',
  'predator:renderDistance',
  'predator:longevity',
  'predator:startingNb',
  'predator:nbOfPreysToEat',
  'predator:eatingInterval'
];

exec(`cd '${__dirname}'/client && npm run start`);

fs.writeFileSync(csvFilePath, convertToCsv(headers));

let i = 0;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.waitFor(1000);

  await page.exposeFunction('done', (time, preyConfig, predatorConfig) => {
    console.log(`${++i} configuration${i > 1 ? 's ont' : ' a'} été générée${i > 1 ? 's' : ''}`);
    const data = [
      time,
      preyConfig.avgSpeed,
      preyConfig.stdDevSpeed,
      preyConfig.avgNbOfBabies,
      preyConfig.stdDevNbOfBabies,
      preyConfig.intervalBetweenReproducingPeriods,
      preyConfig.renderDistance,
      preyConfig.longevity,
      preyConfig.startingNb,
      predatorConfig.avgSpeed,
      predatorConfig.stdDevSpeed,
      predatorConfig.avgNbOfBabies,
      predatorConfig.stdDevNbOfBabies,
      predatorConfig.intervalBetweenReproducingPeriods,
      predatorConfig.renderDistance,
      predatorConfig.longevity,
      predatorConfig.startingNb,
      predatorConfig.nbOfPreysToEat,
      predatorConfig.eatingInterval
    ];
    fs.appendFileSync(csvFilePath, '\n' + convertToCsv(data));
  });

  await page.goto('http://0.0.0.0:8080/');
})();

function convertToCsv(array) {
  return array.map((el) => `"${el}"`).join(',');
}
