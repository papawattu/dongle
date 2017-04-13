export default class Client {
    constructor ({net,host,port,receive}) {
        this.host = host;
        this.port = port;
        this.net = net;
        this.socket = null;
        this.receive = receive;
    }
    connect(cb) {
        console.log('Connecting to : ' + this.host + ' : ' + this.port);
        this.socket = this.net.connect({host: this.host, port: this.port},()=> {
            console.log('Connected');
            this.socket.on('data', this.receive);
            this.socket.on('error', (err) => {
                console.log('Error ' + err);
            });
            this.socket.on('end', () => {
                console.log('Ended ');
            });
            cb()
        });
    }
    send(data) {
        this.socket.write(data);
        this.socket.end();
    }
    close() {
        this.socket.end();
    }
}