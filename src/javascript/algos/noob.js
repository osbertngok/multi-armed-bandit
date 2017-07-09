const Score = require('../models').Score;

const utils = require('../utils');

class Noob {
  constructor(){
    this.name = 'noob';
  }

  getBanditIndex(round, selectedVector, getResultByBanditIndexFunc) {
    const threshold = Math.max(100, Math.floor(this.config.round*0.1));
    let selectedBanditIndex = -1;
    if (round < threshold) {
      selectedBanditIndex = Math.floor(Math.random()*this.config.numOfBandits);
    } else {
      if (this.selectedBanditIndex === undefined) {
        this.selectedBanditIndex = utils.argmax(this.scoreboard,
                                                score => score.positive/(score.positive + score.negative));
      }
      selectedBanditIndex = this.selectedBanditIndex;
    }
    const result = getResultByBanditIndexFunc(selectedBanditIndex);
    this.scoreboard[selectedBanditIndex].process(result);
  }

  loadConfig (config) {
    this.config = config;
    this.scoreboard = [...Array(this.config.numOfBandits)].map(_ => new Score());
  }
}

module.exports = Noob;
