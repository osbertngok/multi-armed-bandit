const System = require('./multiArmedBandits');

const algos = require('./algos');

const gameAsync = () => {
  const system = new System();
  system.loadAlgorithms([new algos.Dumb()]);
  // system.loadAlgorithms([new Noob(), new EpsilonGreedy(), new BayesianMachine()]);
  system.loadConfig({
    "round": 100000,
    "numOfBandits": 3,
    "numOfDimensionOfVector": 1,
    "numOfValuePerDimension": 3
  });
  return system.runAsync();
}

const runGameAsync = async (numOfGames) => {
  for (let i = 0; i < numOfGames; ++i) {
    const p = await gameAsync();
  }
  return 1;
}

const main = () => {
  runGameAsync(10);
}

main();
