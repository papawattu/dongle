export default class Client {
    constructor ({net,host,port,receive}) {
        this.host = host;
        this.port = port;
        this.net = net;
        this.socket = null;
        this.receive = receive;
        this.seq = 1;
        this.chksum = 0xfe;
    }
    connect(cb) {
        console.log('Connecting to : ' + this.host + ' : ' + this.port);
        this.socket = this.net.connect({host: this.host, port: this.port},()=> {
	    this.socket.setKeepAlive(true);
	    this.socket.setNoDelay(true);
	    this.socket.setTimeout(1000);
            console.log('Connected');
            this.startPing();
            this.socket.on('data', (data) => {
		console.log(data.toString('hex'));
//	        this.socket.end();
//	    	this.receive(data);
	    });
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
	this.socket.write(Buffer.from([0xf2,0x0a,0x00,0x01,0x02,0x00,0x00,0x00,0x00,0x00,0x00,0xff,0xf6,0x04,0x00,0xaa,0x00,0xa4,0xf9,0x04,0x00,0x00,0x00,0xfd]));
        setInterval(() => {
	    const ping = Buffer.from([0xf9,0x04,0x00,this.seq,0x00,this.chksum]);
            console.log('ping ' + this.seq + ' ' + ping.toString('hex'));

            this.socket.write(ping);
            this.seq = (this.seq + 1) % 0xff;
            this.chksum = (this.chksum + 1) % 0xff;
        },50);
    }
}
