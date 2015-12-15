var http = require('http');
var express = require('express');
var fs = require('fs');
var io = require('socket.io');
var crypto = require('crypto');

var app = express();
var staticDir = express.static;
var server = http.createServer(app);

io = io(server);

var opts = {
    port: process.env.PORT || 1948,
    baseDir : __dirname + '/build/'
};

io.on( 'connection', function( socket ) {
    socket.on('multiplex-statechanged', function(data) {
        if (typeof data.secret == 'undefined' || data.secret == null || data.secret === '') return;
        if (createHash(data.secret) === data.socketId) {
            data.secret = null;
            socket.broadcast.emit(data.socketId, data);
        }
    });
});

[ 'build', 'images', 'node_modules' ].forEach(function(dir) {
    app.use('/' + dir, staticDir(dir));
});

app.get("/", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(opts.baseDir + '/index.html').pipe(res);
});

app.get("/master", function(req, res) {
    if(req.connection.remoteAddress === '::1') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream(opts.baseDir + '/master/index.html').pipe(res);
    } else {
        res.writeHead(403, {'Content-Type': 'text/plain'});
        res.end();
    }
});

app.get("/token", function(req,res) {
    var ts = new Date().getTime();
    var rand = Math.floor(Math.random()*9999999);
    var secret = ts.toString() + rand.toString();
    res.send({secret: '14501806922406189387', socketId: '573c4f6a4760a0f3'});
});

var createHash = function(secret) {
    var cipher = crypto.createCipher('blowfish', secret);
    return(cipher.final('hex'));
};

// Actually listen
server.listen( opts.port || null );

var brown = '\033[33m',
    green = '\033[32m',
    reset = '\033[0m';

console.log( brown + "reveal.js:" + reset + " Multiplex running on port " + green + opts.port + reset );