const jStat = require('jStat').jStat;

const Score = require('../models').Score;

const utils = require('../utils');

class ContextualBayesianMachine {
  constructor(){
    this.name = 'CBM';
    this.switchToCBM = false;
  }

  get displayName() {
    return `${this.name}${this.switchToCBM?'+':'-'}`;
  }

  getBanditIndex(round, selectedVector, getResultByBanditIndexFunc) {
    let scoreboard;
    if (!this.switchToCBM) {
      if (this.scoreboard.every(score => score.positive + score.negative > this.config.exploreNum)) {
        this.switchToCBM = true;
      }
    }

    if (this.switchToCBM) {
      const context = JSON.stringify(selectedVector);
      if (!this.contextualScoreboard.hasOwnProperty(context)) {
        this.contextualScoreboard[context] = this.scoreboard.map(scoreboard => scoreboard.clone());
      }
      scoreboard = this.contextualScoreboard[context];
    } else {
      scoreboard = this.scoreboard;
    }

    const selectedBanditIndex = utils.argmax(scoreboard,
                                             score => score.positive + score.negative < this.config.exploreNum
                                                      ? Math.random()
                                                      : jStat.beta.sample(score.positive, score.negative));
    const result = getResultByBanditIndexFunc(selectedBanditIndex);
    scoreboard[selectedBanditIndex].process(result);
  }

  loadConfig (config) {
    this.config = config;
    this.scoreboard = [...Array(this.config.numOfBandits)].map(_ => new Score());
    this.contextualScoreboard = {};
  }
}

module.exports = ContextualBayesianMachine;
