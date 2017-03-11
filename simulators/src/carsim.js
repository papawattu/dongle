import net from 'net';

export default class CarSim {
    constructor() {

    }
    start(cb) {
        const server = net.createServer((socket)=> {
            console.log('new connection');
            socket.on('data',(data) => {
                console.log('Got data ' + data.toString('hex'));
            });
            
        })
        server.on('error', (err) => {
            throw err;
        });
        server.listen(8080, (err) => {
            console.log('server bound');
            cb(err);
        });
    }
}