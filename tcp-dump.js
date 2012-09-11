console.log('starting server');
var net = require('net');
var fs = require('fs');

function getPortsArrayFromParameters() {
	if (process.argv.length < 3) {
		throw "enter ports to listen on as parameteres e.g. node TCPDump.js 4000 4004 4005";
	}
	return process.argv.slice(2);
}

function getFileName() {
	var now = new Date();
	return now.getTime();
}

function getTimeNow() {
	return new Date().toUTCString();
}

function getOutputDir() {
	return './output/';
}
function buildFilePathBase(port, fileName) {
	return getOutputDir() + port + '/' + fileName;
}

function createServer(port) {
	var server = net.createServer();
	server.on('connection', function(socket) {

		filePathBase = buildFilePathBase(port, getFileName());
		var dataStream = fs.createWriteStream(filePathBase + '.data');
		var metaStream = fs.createWriteStream(filePathBase + '.meta');
		metaStream.write(getTimeNow() + ' IP ' + socket.remoteAddress + ' socket connected\n');
		
		console.log('new connection\n');

		socket.on('data', function(data) {
			console.log('received data' + data);
			metaStream.write(getTimeNow() + ' data received ' + data + '\n');
		});
		socket.on('close', function(data) {
			console.log('close event');
		
			metaStream.write(getTimeNow() + ' close \n');
			metaStream.end();
			dataStream.end();
		});

		socket.pipe(dataStream);
	});

	server.on('close', function(socket) {
		console.log('socket closed');
	});

	server.listen(port);
}

function createDirectory(name, callback) {
	 fs.mkdir(name, null, callback);
}

ports = getPortsArrayFromParameters();

ports.forEach(function (val, index, array) {
	  console.log(index + ': ' + val);
	  
	  createDirectory(getOutputDir(), function(err) {
		 
		  createDirectory(getOutputDir() + val, function(err) {
			  // todo check err
			  createServer(val);
		  });
	  });
	
});


