var web3 = require('../config').instance();
var RewardRate = require('../config').RewardRate;
var HourlyRate = require('../config').HourlyRate
var BN = web3.utils.BN;

module.exports = function (time) {
  let reward = new BN(HourlyRate).mul(new BN(Math.ceil(time))).toString();
  console.log("Reward: " + reward)
  return reward
}
