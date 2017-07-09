class Score {
  constructor() {
    this.positive = 0;
    this.negative = 0;
  }

  process(result) {
    if (result) {
      this.positive++;
    } else {
      this.negative++;
    }
  }
}

module.exports = {
  'Score': Score
}
