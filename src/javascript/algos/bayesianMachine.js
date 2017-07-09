const Score = require('../models').Score;

const utils = require('../utils');

class BayesianMachine {
  constructor(){
    this.name = 'BM';
  }

  getBanditIndex(round, selectedVector, getResultByBanditIndexFunc) {
    let selectedBanditIndex = -1;
    if (Math.random() < 0.1) { // epsilon
      selectedBanditIndex = Math.floor(Math.random()*this.config.numOfBandits);
    } else {
      selectedBanditIndex = utils.argmax(this.scoreboard,
                                                score => score.positive + score.negative === 0 ? 0 : score.positive/(score.positive + score.negative));
    }
    const result = getResultByBanditIndexFunc(selectedBanditIndex);
    this.scoreboard[selectedBanditIndex].process(result);
  }

  loadConfig (config) {
    this.config = config;
    this.scoreboard = [...Array(this.config.numOfBandits)].map(_ => new Score());
  }
}

module.exports = EpsilonGreedy;
