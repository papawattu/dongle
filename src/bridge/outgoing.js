export default class Outgoing {
    constructor ({net,host,port,incoming}) {
        this.host = host;
        this.port = port;
        this.net = net;
        this.incoming = incoming;
        this.socket = null;
    }
    connect(cb) {
        console.log('Connecting to PHEV Wifi : ' + this.host + ' : ' + this.port);
        this.socket = this.net.connect({host: this.host, port: this.port},()=> {
            console.log('Connected');
            cb();
        });
        this.socket.on('data', (data) => {
            this.incoming.send(data);       
        });
    }
    send(data) {
        this.socket.write(data);
    }
}