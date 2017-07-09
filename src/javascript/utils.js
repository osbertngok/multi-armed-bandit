const argmax = (arr, func) => arr.map(item => func ? func(item): item)
                                 .reduce((accumulator, currentValue, currentIndex) => !accumulator || currentValue > accumulator[1]
                                                                                      ? [currentIndex, currentValue]
                                                                                      : accumulator, undefined)[0];

module.exports = {
  "argmax": argmax
};
