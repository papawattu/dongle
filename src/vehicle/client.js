export default class Client {
    constructor ({net,host,port,receive}) {
        this.host = host;
        this.port = port;
        this.net = net;
        this.socket = null;
        this.receive = receive;
        this.seq = 0;
        this.chksum = 0xfd;
    }
    connect(cb) {
        console.log('Connecting to : ' + this.host + ' : ' + this.port);
        this.socket = this.net.connect({host: this.host, port: this.port},()=> {
            console.log('Connected');
            this.startPing();
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
      //  this.socket.end();
    }
    close() {
        this.socket.end();
    }
    startPing() {
        setInterval(() => {
            console.log('ping ' + this.seq);
            this.socket.write(Buffer.from([0xf9,0x04,0x00,this.seq,0x00,this.chksum]));
            this.seq = (this.seq + 1) % 0xff;
            this.chksum = (this.chksum + 1) % 0xff;
        },50);
    }
}