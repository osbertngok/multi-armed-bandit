const System = require('./multiArmedBandits');

const algos = require('./algos');

const gameAsync = () => {
  const system = new System();
  system.loadAlgorithms([new algos.Dumb(), new algos.EpsilonGreedy(), new algos.Noob(), new algos.BayesianMachine()]);
  // system.loadAlgorithms([new Noob(), new EpsilonGreedy(), new BayesianMachine()]);
  system.loadConfig({
    "round": 100000,
    "numOfBandits": 3,
    "numOfDimensionOfVector": 1,
    "numOfValuePerDimension": 3,
    "baseLevel": 2,
    "contextLevel": 2,
    "exploreNum": 1000,
    "exploreRatio": 0.03
  });
  return system.runAsync();
}

const runGameAsync = async (numOfGames) => {
  const gameScores = [];
  for (let i = 0; i < numOfGames; ++i) {
    gameScores.push(await gameAsync());
  }
  const finalGameScore = gameScores.reduce((accumulator, currentValue, currentIndex) => {
    if (accumulator.hasOwnProperty('zRegret')) {
      for (let key in currentValue) {
        accumulator[key] += currentValue[key];
      }
      return accumulator;
    } else {
      const newAccumulator = {};
      for (let key in currentValue) {
        newAccumulator[key] = currentValue[key];
      }
      return newAccumulator;
    }
  }, {});
  let statement = '';
  for (let key in finalGameScore) {
    statement += '(' + key + '): ' + (finalGameScore[key]/finalGameScore['zRegret']*100).toFixed(2) + '%, ';
  }

  console.log('------------ final result -------------');
  console.log(statement);
}

const main = () => {
  runGameAsync(20);
}

main();
