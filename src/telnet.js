const telnet = require('telnet-client');
const path = require('path');
const connection = new telnet();
const fs = require('fs');

var params = {
  host: '192.168.99.100',
  port: 2323,
  shellPrompt: '>',
  timeout: 99999999,
  debug: true,
  stripShellPrompt: false,
  // removeEcho: 4 
};
 
connection.on('ready', function(prompt) {
  try {
      console.log('Path ' + __dirname);
      const file = fs.readFileSync('out.min.js');
      //console.log(file.toString());
      connection.send(file.toString(), function(err, response) {
        console.log(response);
        connection.end();
      });
  } catch(e) {
    console.log(e);
  }
});
 
connection.on('timeout', function() {
  console.log('socket timeout!')
  connection.end();
});
 
connection.on('close', function() {
  console.log('connection closed');
});



connection.connect(params);
