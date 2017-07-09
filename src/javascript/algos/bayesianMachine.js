const jStat = require('jStat').jStat;

const Score = require('../models').Score;

const utils = require('../utils');

class BayesianMachine {
  constructor(){
    this.name = 'BM';
  }

  getBanditIndex(round, selectedVector, getResultByBanditIndexFunc) {
    // Calculate Beta Sample for all bandits.
    // If alpha and beta are zero, use uniform distribution
    /*
    const selectedBanditIndex = utils.argmax(this.scoreboard,
                                             score => score.positive + score.negative === 0
                                                      ? Math.random()
                                                      : jStat.beta.sample(score.positive, score.negative));
    */
    const probs = this.scoreboard.map(score => score.positive + score.negative < 100
             ? Math.random()
             : jStat.beta.sample(score.positive, score.negative));
    const selectedBanditIndex = utils.argmax(probs);
    const result = getResultByBanditIndexFunc(selectedBanditIndex);
    this.scoreboard[selectedBanditIndex].process(result);
  }

  loadConfig (config) {
    this.config = config;
    this.scoreboard = [...Array(this.config.numOfBandits)].map(_ => new Score());
  }
}

module.exports = BayesianMachine;
