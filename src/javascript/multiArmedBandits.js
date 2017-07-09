const deepFreeze = require('deep-freeze');

class Score {
  constructor() {
    this.positive = 0;
    this.negative = 0;
  }
}

class MultiArmedBandits {
  constructor() {
    this.baseProbability = [];
    this.givenProbability = [];
  }

  getBanditIndex(aIndex, round, selectedVector, callback) {
    this.algorithms[aIndex].getBanditIndex(round, selectedVector, callback);
  }

  getNewVector() {
    const dct = this.config.numOfDimensionOfVector;
    const vct = this.config.numOfValuePerDimension;
    return [...Array(dct)].map(_ => Math.floor(Math.random() * vct));
  }

  getProbability(bIndex, selectedVector) {
    const dct = this.config.numOfDimensionOfVector;
    let probability = this.baseProbability[bIndex];
    for (let dIndex = 0; dIndex < dct; ++dIndex) {
      probability *= this.givenProbability[bIndex][dIndex][selectedVector[dIndex]];
    }
    return probability;
  }

  getTossResult(bIndex, selectedVector) {
    const probability = this.getProbability(bIndex, selectedVector);
    return Math.random() < probability;
  }

  loadAlgorithms(algorithms) {
    this.algorithms = algorithms;
  }

  loadConfig(config) {
    this.config = config;
    deepFreeze(this.config);
    this.algorithms.forEach(algo => algo.loadConfig(this.config));
  }

  negativeLog(probability) {
    return -Math.log2(probability).toFixed(2);
  }

  async run() {
    const bct = this.config.numOfBandits;
    const dct = this.config.numOfDimensionOfVector;
    const vct = this.config.numOfValuePerDimension;
    const act = this.algorithms.length;
    const scoreboard = [...Array(act)]
                        .map(_ => new Score());
    const zeroRegretScoreboard = new Score();
    this.baseProbability = [...Array(bct)]
                           .map(_ => 0.2 + Math.random()*0.1);
    this.givenProbability = [...Array(bct)]
                            .map(_ => [...Array(dct)]
                              .map(_ => [...Array(vct)]
                                .map(_ => Math.random())
                              )
                            );

    for (let round = 0; round < this.config.round; ++round) {
      const selectedVector = this.getNewVector();
      const tossResults = [...Array(bct).keys()].map(bIndex => this.getTossResult(bIndex, selectedVector));
      const algoSelectedBandit = [...Array(act)].map(_ => -1);
      const algoSelectedResult = [...Array(act)].map(_ => -1);
      for (let aIndex = 0; aIndex < this.algorithms.length; ++aIndex) {
        const promise = new Promise((resolve, reject) => {
          try {
            this.getBanditIndex(aIndex, round, selectedVector, selectedBanditIndex => {
              resolve(selectedBanditIndex);
              return tossResults[selectedBanditIndex];
            });
          } catch (e){
            console.log(e);
            reject(e);
          }
        });
        try {
          const selectedBanditIndex = await promise;
          algoSelectedBandit[aIndex] = selectedBanditIndex;
          algoSelectedResult[aIndex] = tossResults[selectedBanditIndex];
          if (tossResults[selectedBanditIndex]) {
            scoreboard[aIndex].positive++;
          } else {
            scoreboard[aIndex].negative++;
          }
        } catch (e) {
          console.log(e);
          exit(-1);
        }
      }
      // argmax bandit that yields best probability
      const zeroRegretBanditIndex = [...Array(bct).keys()]
        .map(bIndex => this.getProbability(bIndex, selectedVector))
        .reduce((accumulator, currentValue, currentIndex) => !accumulator || currentValue > accumulator[1]
                                                             ? [currentIndex, currentValue]
                                                             : accumulator, undefined)[0];
      const zeroRegretSelectedResult = tossResults[zeroRegretBanditIndex];
      if (tossResults[zeroRegretBanditIndex]) {
       zeroRegretScoreboard.positive++;
      } else {
       zeroRegretScoreboard.negative++;
      }
      // Print Result
      let statement = 'Round ' + round + " ";
      for (let aIndex = 0; aIndex < this.algorithms.length; ++aIndex) {
        statement += '(' + aIndex + '):' + algoSelectedBandit[aIndex] + ',' + algoSelectedResult[aIndex] + '(' + scoreboard[aIndex].positive + ')' + '; ';
      }
      statement += '(zRegret): ' + zeroRegretBanditIndex + ',' + zeroRegretSelectedResult + '(' + zeroRegretScoreboard.positive + ')' + ';';
      console.log(statement);
    }
  }
}

module.exports = MultiArmedBandits;
