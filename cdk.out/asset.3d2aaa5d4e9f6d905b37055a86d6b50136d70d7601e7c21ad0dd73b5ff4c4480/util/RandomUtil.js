const randomIntBetween = (minNumber, maxNumber) => {
    let randomInt = 0;
    if(maxNumber !== 0) {
        let difference = maxNumber - minNumber;
        let randomDifference = Math.floor((Math.random() * 10 * maxNumber) % difference);
        randomInt = minNumber + randomDifference
    }
    return randomInt;
}

const randomFloatBetween = (minNumber, maxNumber) => {
    let randomFloat = '0.00';
    if(maxNumber !== 0) {
        let difference = maxNumber - minNumber;
        let randomDifference = (Math.random() * 10 * maxNumber % difference);
        randomFloat = (minNumber + randomDifference).toFixed(2);
    }
    return randomFloat;
}


function formatNumber(num, precision = 2) {
    const map = [
      { suffix: 'T', threshold: 1e12 },
      { suffix: 'B', threshold: 1e9 },
      { suffix: 'M', threshold: 1e6 },
      { suffix: 'K', threshold: 1e3 },
      { suffix: '', threshold: 1 },
    ];
  
    const found = map.find((x) => Math.abs(num) >= x.threshold);
    if (found) {
      const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
      return formatted;
    }
  
    return num;
  }

module.exports = {
    randomIntBetween: randomIntBetween,
    randomFloatBetween: randomFloatBetween
};