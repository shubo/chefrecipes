
const http = require('http');
const server = http.createServer();

const requestMapping = require('./RequestMapping');

server.on('request', function(req, res){

  requestMapping.forward(req, res);
});

server.listen(1990);
