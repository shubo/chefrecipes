
var http = require('http');
var server = http.createServer();

var requestMapping = require('./RequestMapping');

server.on('request', function(req, res){

  requestMapping.forward(req, res);
});

server.listen(1990);
