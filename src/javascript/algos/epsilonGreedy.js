const Score = require('../models').Score;

const utils = require('../utils');

class EpsilonGreedy {
  constructor(){
    this.name = 'E.G.';
  }

  getBanditIndex(round, selectedVector, getResultByBanditIndexFunc) {
    const threshold = Math.max(10, Math.floor(this.config.round*0.1));
    let selectedBanditIndex = -1;
    if (round < threshold || Math.random() < 0.1) { // epsilon
      selectedBanditIndex = Math.floor(Math.random()*this.config.numOfBandits);
    } else {
      selectedBanditIndex = utils.argmax(this.scoreboard,
                                                score => score.positive/(score.positive + score.negative));
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
