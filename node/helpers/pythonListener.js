var postTransaction = require('./postTransaction').postTransaction;

exports.pythonListener = function() {
  var spawn = require('child_process').spawn;
  var py    = spawn('python', ['../python/facial_detection_realtime.py']);
  var splitted = []

  py.stdout.on('data', function(data){
    splitted = data.toString('utf8').split(" ");
    postTransaction(splitted[0], splitted[1])
  });

  py.stdout.on('end', function(){
    console.log("Terminating python process!");
  });

}
