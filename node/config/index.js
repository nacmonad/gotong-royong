var Web3 = require('web3')
//var web3 = new Web3(new Web3.providers.WebsocketProvider(`ws://localhost:8546`));
var web3 = new Web3(new Web3.providers.HttpProvider(`http://localhost:8545`));
var hexToBytes = require('../helpers/hexToBytes').hexToBytes;
var ethUtil = require('ethereumjs-util')

//var contractAddress = `0x5d37cdc97ce2cb9dbb3b117a2d18703b5da0b023`;
//var contractAddress = `0x4f7167270f1df6138a37bad03dc753d89bbf86ff`;
  // 0x354db5ae17b11fbc01a8a146b63506b1d90872e0

//var contractAddress = `0xa6663613e1ec34590986e6150f111d255e6fe982`;  //My Switch Coin v1.1 Kovan
var contractAddress = `0xa7af38Cb6C0c5C7Ee6954F80f457d10DD705FE98`; //KinetiCoin v1 Kovan
var ABI = JSON.parse(`[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"currentSupply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_newRate","type":"uint256"}],"name":"setRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getSwitchState","outputs":[{"name":"currentState","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"RATE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getRate","outputs":[{"name":"currentRate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amountToAdd","type":"uint256"}],"name":"addToAuction","outputs":[{"name":"status","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"switchState","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"issueToken","outputs":[{"name":"response","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"toggleSwitch","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAvailableForAuction","outputs":[{"name":"available","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"recipient","type":"address"},{"name":"_value","type":"uint256"}],"name":"awardToken","outputs":[{"name":"response","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newState","type":"bool"}],"name":"SwitchEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"TokensAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newRate","type":"uint256"}],"name":"RateChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]`);

var priv = `ddca384fe70089179607956da040f7357b29b3c5abf779a9d62db57f9dfb293e`  //hurt me plenty

exports.instance = function() {
  return web3;
}
exports.tokenContract = function () {
  return new web3.eth.Contract(ABI, contractAddress);
}

exports.Account = function() {
  //0x in front of privkey is important!
  var acc = web3.eth.accounts.privateKeyToAccount(priv);
  acc.public = "0x" + ethUtil.privateToAddress(hexToBytes(priv)).toString('hex')
  return acc
}

/*
Available Accounts
==================
(0) 0x5f53bcd06cdaefe3d2699a4215f9ca55ee168e68
(1) 0x4e25d2a4bf8a427a2b4639c012d9612ca5066f11
(2) 0xadef837485cc23e4c8dfda4f31d5643cef842ac4
(3) 0x37cf9a78d70a4decd09886349df143287086556f
(4) 0x1fa88670c67e57e0e0768d36f5b78a7c404ecb82
(5) 0xd7d93f668583a318a9fe3bbf4a7f57803f8ab51a
(6) 0xfc48e532b01a85244d9db99eb47c539f9b8e1674
(7) 0x9927f0c5d9eb07f1d384f10045604aa01bb5eec2
(8) 0x3ae0c8a8151f40f5ed77310f0965c22aaeaeba23
(9) 0x02c52ceee9671b99152dff00172a53759d8b081a

Private Keys
==================
(0) 12c38c3669d65cc2b937e1958fe4fc09f4b2d6ecd5aed38e1e293caed5f9e7e6
(1) 42b8e92e9a66d0f0d5d89be613d1d518a0106fac37e5233c3c214cfb8dc037e4
(2) 4fc3a27b75a0fc8aad524e3a6cc53ae4a2e3d49a533995ca547504d0a4b7f44e
(3) 694bb5be4137bb109a345ae8ac22bc6e765c4a4a3a0ca374b1a9762607f2eaf6
(4) 2ab4b8f71e69ea5d22e9326924554eb2bf21153cdd3333699371eae0d26007fa
(5) 381f2a19e5a6d7022902c96affc65662f9983db2636b56dddebbba4f1445c4c1
(6) 4b5f5a053d8cfc7d7973ad12a2a6318eb37a954a7d8e545d3ce3d59bde2695ac
(7) 2bf83062e9455e4f30efde43880d5baadec0b44773ea935329cfc8f762323a27
(8) dee53130fbfaaab074b6b85eb7be41624e416079900f810b38b61095b13da21e
(9) ddca384fe70089179607956da040f7357b29b3c5abf779a9d62db57f9dfb293e
*/
