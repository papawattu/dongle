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
        this.serverReceive = this.serverInit;
        this.clientReceive = this.clientInit;
        //this.net = net;
        this.client = new Outgoing({ net, host: clientHost, port: clientPort, receive: this.clientReceive.bind(this) });
        this.server = new Outgoing({ net, host: serverHost, port: serverPort, receive: this.serverReceive.bind(this) })


        this.initHandler = new InitHandler({
            serialNum: '1234', 
            writeCallback: this.server.send.bind(this.server), 
            errorCallback: (err) => {
                console.log('Error ' + err);
                this.server.close();
            },
            readyCallback: () => {
                this.serverReceive = this.commandLoop;
            }
        });

        this.commandHandler = new CommandHandler({
            writeCallback: this.server.send.bind(this.server),
            sendCommand: this.client.send.bind(this.client),
        });
        this.server.connect((err) => {
            if (err) throw err;

        });

    }
    serverCommandLoop(data) {
        this.commandHandler.handle(data);
    }
    serverInit(data) {
        this.initHandler.handle(data);
    }
    clientInit(data) {

    }
}