export default class Outgoing {
    constructor ({net,host,port,receive}) {
        this.host = host;
        this.port = port;
        this.net = net;
        this.receive = receive;
        this.socket = null;
    }
    connect(cb) {
        console.log('Connecting to : ' + this.host + ' : ' + this.port);
        this.socket = this.net.connect({host: this.host, port: this.port},()=> {
            console.log('Connected');
            cb();
        });
        this.socket.on('data', (data) => {
            this.receive(data);       
        });
    }
    send(data) {
        this.socket.write(data);
    }
    close() {
        this.socket.end();
    }
}