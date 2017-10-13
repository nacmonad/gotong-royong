var tokenContract = require('../config').tokenContract()
var web3 = require('../config').instance();
var Account = require('../config').Account()
var addressParser = require('./addressParser');
var calculateReward = require('./calculateReward');

exports.postTransaction = function (address, time) {

  console.log(time)
  console.log(addressParser(address))
  //console.log(calculateReward(time))
  console.log(Account)

  let tx = {}
  const promises = [
    web3.eth.getTransactionCount(Account.address),
    web3.eth.getGasPrice(),

  ];
  Promise.all(promises)
    .then(data => {
      console.log("First handler", data);

      tx.nonce = data[0];
      tx.from = Account.address;
      tx.to = tokenContract.options.address;
      tx.data = tokenContract.methods.awardToken(addressParser(address), calculateReward(time)).encodeABI();
      tx.gas = data[1];
      tx.gasPrice = 20000000000;  //20 GWei
      tx.gasLimit = 200000;

      console.log(tx)
      return tx;
    })
    .then(tx => {
      console.log("Second handler -- signing tx", tx);

      return Account.signTransaction(tx, Account.privateKey);
    })
    .then(signedTx => {
      console.log("Sending signed transaction:", signedTx)
      web3.eth.sendSignedTransaction(signedTx.rawTransaction).then(console.log).catch(console.log);

    });
}
