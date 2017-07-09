const System = require('./multiArmedBandits');

const algos = require('./algos');

const main = () => {
  const system = new System();
  system.loadAlgorithms([new algos.Dumb()]);
  // system.loadAlgorithms([new Noob(), new EpsilonGreedy(), new BayesianMachine()]);
  system.loadConfig({
    "round": 100000,
    "numOfBandits": 3,
    "numOfDimensionOfVector": 1,
    "numOfValuePerDimension": 3
  });
  system.run()
  .then(() => {})
  .catch(e => {
    console.log(e);
  });
}

main();
