import net from 'net';
import Outgoing from './outgoing';
import Incoming from './incoming';


export default class App {
    constructor({ outgoingHost = '192.168.8.46', outgoingPort = 8080, incomingPort = 8081 } = {}) {
        this.outgoingHost = outgoingHost;
        this.outgoingPort = outgoingPort;
        this.incomingPort = incomingPort;
        this.outgoing = null;
        this.incoming = new Incoming({ net, port: incomingPort, outgoing: this.outgoing })
        this.outgoing = new Outgoing({ net, host: outgoingHost, port: outgoingPort, incoming: this.incoming });

        this.outgoing.connect((err) => {
            if(err) throw err;
            this.incoming.startServer((err) => {
                if(err) throw err;
            });
        });
    }
}