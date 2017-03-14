export default class Incoming {
    constructor({ net, host, port, outgoing }) {
        this.host = host;
        this.port = port;
        this.net = net;
        this.outgoing = outgoing;

        this.socket = null;
    }
    startServer(cb) {
        console.log('Starting Server : ' + this.host + ' : ' + this.port);
        this.server = this.net.createServer((socket) => {
            this.socket = socket;
            console.log('new connection ' + this.outgoing);
            this.socket.on('data', this.outgoing.send.bind(self));
        

        })
        this.server.on('error', (err) => {
            throw err;
        });

        this.server.listen(this.port, (err) => {
            console.log('server bound');
            cb(err);
        });
    }
    send(data) {
        this.socket.write(data);
    }
}