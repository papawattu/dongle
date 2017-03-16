import Outgoing from './outgoing';
import Incoming from './incoming';
import InitHandler from '../external_controller/init_handler';
import CommandHandler from '../external_controller/command_handler';


export default class Bridge {
    constructor({ net,clientHost = '192.168.8.46', clientPort = 8080, serverHost = 'localhost', serverPort = 1974 } = {}) {
        this.clientHost = clientHost;
        this.clientPort = clientPort;
        this.serverHost = serverHost;
        this.serverPort = serverPort;
        this.receive = this.init;
        this.net = net;
        //this.client = new Outgoing({ net, host: clientHost, port: clientPort, receive: this.receive.bind(this) });
        this.server = new Outgoing({ net: this.net, host: serverHost, port: serverPort, receive: this.receive.bind(this) })


        this.initHandler = new InitHandler({
            serialNum: '1234', 
            writeCallback: this.server.send.bind(this.server), 
            errorCallback: (err) => {
                console.log('Error ' + err);
                this.server.close();
            },
            readyCallback: () => {
                this.receive = this.commandLoop;
            }
        });

        this.commandHandler = new CommandHandler({
            writeCallback: this.server.send.bind(this.server),
        });
        this.server.connect((err) => {
            if (err) throw err;

        });

    }
    commandLoop(data) {
        this.server.send(this.commandHandler.handle(data));
    }
    init(data) {
        this.initHandler.handle(data);
    }
}