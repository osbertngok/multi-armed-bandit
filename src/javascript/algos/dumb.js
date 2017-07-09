class Dumb {
  constructor(){
    this.name = 'dumb';
  }

  getBanditIndex(round, selectedVector, getResultByBanditIndexFunc) {
    const result = getResultByBanditIndexFunc(0);
  }

  loadConfig () {

  }
}

module.exports = Dumb;
