class Score {
  constructor() {
    this.positive = 0;
    this.negative = 0;
  }

  clone() {
    const ret = new Score();
    ret.postive = this.positive;
    ret.negative = this.negative;
    return ret;
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
