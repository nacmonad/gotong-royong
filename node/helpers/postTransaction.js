var tokenContract = require('../config').tokenContract()
var w3 = require('../config').instance();
var Account = require('../config').Account()
var EthTx = require('ethereumjs-tx');
var addressParser = require('./addressParser')

exports.postTransaction = async function (address, time) {
  //check if iban address
  console.log(time)
  console.log(Account)

  try {
    // suppose you want to call a function named myFunction of myContract
    tokenContract.methods.awardToken(addressParser(address),1)
        .send({from:Account.public})
        .then(console.log);

    /*var balance = await tokenContract.methods.balanceOf("0x5f53bcd06cdaefe3d2699a4215f9ca55ee168e68").call()
    var gasPrice = await w3.eth.getGasPrice()
    var hashRate = await w3.eth.getHashrate()
    //console.log(w3.Iban.toAddress())
    var pkey1 = new Buffer(Account.privateKey, 'hex')
    var nonce = await w3.eth.getTransactionCount(Account.public)
    var to = ''
    var gasLimit = 210000

    var value = 0;

    //console.log(tokenContract.methods)
    var rate = await tokenContract.methods.getRate().call()
    var switchState = await tokenContract.methods.getSwitchState().call()
    var availableForAuction = await tokenContract.methods.getAvailableForAuction().call()

    console.log({
      pkey1:pkey1.toString('hex'),
      nonce,
      gasPrice,
      rate,
      switchState,
      availableForAuction,
      superSpecialtokens:balance
    })*/

  } catch (e) {
    console.log(e)
  }
}
