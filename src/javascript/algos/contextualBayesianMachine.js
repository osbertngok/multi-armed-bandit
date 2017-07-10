const jStat = require('jStat').jStat;

const Score = require('../models').Score;

const utils = require('../utils');

class ContextualBayesianMachine {
  constructor(){
    this.name = 'CBM';
    this.switchToCBM = false;
  }

  getBanditIndex(round, selectedVector, getResultByBanditIndexFunc) {
    let scoreboard;
    if (!this.switchToCBM) {
      if (this.scoreboard.every(score => score.positive > 0)) {
        this.switchToCBM = true;
        console.log('turbo!');
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

    const selectedBanditIndex = round < this.config.exploreNum
                                ? Math.floor(Math.random()*this.config.numOfBandits)
                                : utils.argmax(scoreboard, score => jStat.beta.sample(score.positive, score.negative));
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
