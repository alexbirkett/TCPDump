var net = require('net');


var client = net.createConnection(4000, "localhost");

client.addListener("connect", function(){
    client.end("test data2");
    console.log("done");
});