var tokenContract = require('../config').tokenContract()

exports.postTransaction = function (address, time) {
  console.log(tokenContract)
  console.log(address)
  console.log(time)
  //web3.eth.accounts.signTransaction(tx, privateKey [, callback]);
}
