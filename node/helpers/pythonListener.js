var postTransaction = require('./postPiTransaction').postTransaction;


exports.pythonListener = function() {
  var spawn = require('child_process').spawn;

  var splitted = []

  //var youtubeUploader = require('./youtubeUploader').youtubeUploader(__dirname + '/../../python/derp.avi');
  function spawnProcess() {
    //var py    = spawn('python', ['../python/body_detection_realtime.py']);
    var py    = spawn('python', ['../python/facial_detection_realtime.py']);
    py.stdout.on('data', function(data){
      splitted = data.toString('utf8').split(" ");
      postTransaction(splitted[0], splitted[1]);
    });

    py.stdout.on('end', function(){
      console.log("Python process terminated, respawning!");
      spawnProcess();
    });
  }

  spawnProcess();
}
