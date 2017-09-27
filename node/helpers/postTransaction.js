var tokenContract = require('../config').tokenContract()
var web3 = require('../config').instance();
var Account = require('../config').Account()
var addressParser = require('./addressParser');
var calculateReward = require('./calculateReward');

exports.postTransaction = async function (address, time) {
  //check if iban address
  console.log(address)
  console.log(time)
  console.log(addressParser(address))
  //console.log(calculateReward(time))
  console.log(Account)

  try {
    //web3.eth.personal.unlockAccount(web3.eth.coinbase);

    web3.eth.getBalance(Account.address).then(console.log)
    // var response = await tokenContract.methods.awardToken(addressParser(address),1).send({from:Account.public})
    // console.log(response)

    let tx = {}
    //tx.nonce = await web3.eth.getTransactionCount(Account.public);
    tx.nonce = await web3.eth.getTransactionCount(Account.address);  //lost some tx failed nonces
    tx.chainId = 42;  //Kovan
    tx.from = Account.address;
    tx.to = tokenContract.options.address;
    tx.data = tokenContract.methods.awardToken(addressParser(address), calculateReward(time)).encodeABI();
    // //tx.gas = await web3.eth.getGasPrice();
    tx.gas = 228888;
    tx.gasPrice = 20000000000;  //20 GWei
    tx.gasLimit = 200000;

    console.log(tx)

    const signedTx = await Account.signTransaction(tx, Account.privateKey);
    console.log(signedTx)

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(receipt)

   } catch (e) {
     console.log(e)
    //  //web3.eth.net.getId().then(console.log)
    web3.eth.getBalance(Account.address).then(console.log)
   }


}
