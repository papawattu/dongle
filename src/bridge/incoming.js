export default class Incoming {
    constructor({ net, host, port, outgoing }) {
        this.host = host;
        this.port = port;
        this.net = net;
        this.outgoing = outgoing;

        this.socket = null;
    }
    startServer(cb) {
        const self = this;
        console.log('Starting Server : ' + this.host + ' : ' + this.port);
        this.server = this.net.createServer((socket) => {
            console.log('new connection');
            this.socket = socket;
            this.socket.on('data', self.outgoing.send.bind(self));
        

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