var w3 = require('../config').instance();

module.exports = function (addr) {
  //check if iban
  //['iban:XE09PL8R2TKEDW95D568HBSRX1YJR3AKX31?amount=0&token=ETH']
  //or if normal public
  // ['0x5f53bcd06cdaefe2d2699a4215f9ca55ee168e68']

  //strips unneccessary chars
  addr = addr.replace("'", "");
  addr = addr.replace("'", "");
  addr = addr.replace("[", "");
  addr = addr.replace("]", "");
  addr = addr.replace("ethereum:", "");
  //if IBAN address qr code
  if(addr.substring(0,4) === "iban" ) {
    addr = addr.match(/:([^"]*)\?/g);
    addr = addr[0].substring(1, addr[0].length-1)
    addr = w3.eth.Iban.toAddress(addr)
  }
  //metamask qr codes
  if(addr.substring(0,4) === "ethereum") {
    addr = addr.match(/:([^"]*)\?/g);
    addr = addr[0].substring(1, addr[0].length-1)

  }
  return addr
}
