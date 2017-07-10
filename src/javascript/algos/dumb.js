class Dumb {
  constructor(){
    this.name = 'dumb';
  }

  get displayName() {
    return this.name;
  }

  getBanditIndex(round, selectedVector, getResultByBanditIndexFunc) {
    const result = getResultByBanditIndexFunc(0);
  }

  loadConfig () {

  }
}

module.exports = Dumb;
