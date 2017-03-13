import net from 'net';
import Parser from './parser';
import Handler from './handler';

export default class CarSim {
    constructor() {
        this.handler = new Handler().handle;
        this.parser = new Parser(this.handler.bind(this));
        this.server = null;
        this.buffer = Buffer.alloc(0);
    }
    start(cb) {
        this.server = net.createServer((socket)=> {
            console.log('new connection');
            socket.on('data',(data) => {
                console.log('Got data ' + data.toString('hex'));
                socket.write(this.parser.process(data));
            });
            
        })
        this.server.on('error', (err) => {
            throw err;
        });

        this.server.listen(8080, (err) => {
            console.log('server bound');
            cb(err);
        });
    }
    stop(cb) {
        this.server.close(cb);
    }

}