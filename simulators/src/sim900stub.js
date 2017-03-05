import net from 'net';
import * as log from 'winston';
import retry from 'retry';

const DONGLEHOST = process.env.DONGLE_2222_TCP_ADDR || 'localhost';
const DONGLEPORT = process.env.DONGLE_2222_TCP_PORT || 2222;

const PHEVHOST = process.env.PHEV_1974_TCP_ADDR || 'localhost';
const PHEVPORT = process.env.PHEV_1974_TCP_PORT || 1974;

export default class Sim900Stub {
    constructor({ dongleHost = DONGLEHOST, donglePort = DONGLEPORT, phevHost = PHEVHOST, phevPort = PHEVPORT,}) {
        this.dongleSocket = null;
        this.dongleHost = dongleHost;
        this.donglePort = donglePort;
        this.phevHost = phevHost;
        this.phevPort = phevPort;
        
        this.buffer = '';
        this.connected = false;
        this.isData = false;
        this.dataLength = 0;
    }
    connect() {
        const op = retry.operation({
            forever: true,
            factor: 1,
        });

        let attempt = 1;

        op.attempt(() => {
            this.connected = false;
            log.info('Trying to connect to adapter (SIM900) ' + this.dongleHost + ':' + this.donglePort + ' attempt #' + attempt);

            this.dongleSocket = net.connect({ port: this.donglePort, host: this.dongleHost }, () => {
                log.info('Connected');
                this.connected = true;
            });
            this.dongleSocket.on('error', (err) => {
                attempt++;
                if (op.retry(err)) {
                    return;
                }
            });
            this.dongleSocket.on('data', this.handler.bind(this));
            
            this.dongleSocket.on('close',() => {
                if(this.connected) {
                    log.info('Dongle socket closed retrying');
                    this.connect();
                }
            }); 
        });
    }
    respond(response) {
        log.info('RESPONSE : ' + response + '\r\n');
        this.dongleSocket.write(response + '\r\n');
    }
    ok() {
        return 'OK';
    }
    stripCommand(data) {
        return data.substr(0, data.indexOf('\r'));
    }
    sendData(data) {
        const d = '+RECEIVE,0,' + data.length + ':\r\n' + data;
        log.info('SENDING DATA : ' + d);
        this.dongleSocket.write(d);
    }
    startProxy() {
        const op = retry.operation({
            forever: true,
            factor: 1,
        });

        let attempt = 1;

        op.attempt(() => {
            log.info('Trying to connect to PHEV Controller ' + this.phevHost + ':' + this.phevPort + ' attempt #' + attempt);

            this.phevSocket = net.connect({ port: this.phevPort, host: this.phevHost }, () => {
                log.info('Connected');
            });
            this.phevSocket.on('error', (err) => {
                attempt++;
                if (op.retry(err)) {
                    return;
                }
            });
            this.phevSocket.on('data', this.phevHander.bind(this));

            this.phevSocket.on('close', () => {
                log.info('PHEV Socket closed');
                this.startProxy();
            });
        });
    }
    phevHander(data) {
        log.info('RECEIVED DATA FROM PHEV : ' + data);
        this.sendData(data);
    }
    handleData(data) {
        this.buffer += data;
        if (this.buffer.length == this.dataLength) {
            log.info('RECEIVED DATA :' + this.buffer);
            this.phevSocket.write(this.buffer);
            this.isData = false;
            this.respond('0, SEND OK');
            this.buffer = '';
        }
    }
    handler(data) {
        if (this.isData) {
            this.handleData(data.toString());
        } else {
            this.buffer += data.toString();

            if (this.buffer.indexOf('\r') != -1) {
                log.info('COMMAND : ' + this.buffer);
                const cmd = this.stripCommand(this.buffer).split('=');
                switch (cmd[0]) {
                    case 'ATE0': this.respond(this.ok()); break;
                    case 'AT+CPIN?': this.respond(this.ok()); break;
                    case 'AT+CGATT': this.respond(this.ok()); break;
                    case 'AT+CIPSHUT': this.respond('SHUT OK'); break;
                    case 'AT+CIPSTATUS': this.respond('STATE: IP INITIAL'); break;
                    case 'AT+CIPMUX': this.respond(this.ok()); break;
                    case 'AT+CIPHEAD': this.respond(this.ok()); break;
                    case 'AT+CSTT': this.respond(this.ok()); break;
                    case 'AT+CIICR': this.respond(this.ok()); break;
                    case 'AT+CIFSR': this.respond('1.1.1.1'); break;
                    case 'AT+CIPSTART': {
                        log.info('Connected to WAN');
                        this.connected = true;
                        this.respond(this.ok());
                        this.respond('0, CONNECT OK');
                        this.startProxy();
                        break;
                    }
                    default: {
                        if (this.buffer.indexOf('AT+CIPSEND=0,') >= 0) {
                            const len = this.buffer.indexOf('\r');
                            this.dataLength = this.buffer.substr(this.buffer.indexOf(',') + 1, len);
                            this.dongleSocket.write('\r\n>');
                            this.isData = true;
                            log.info('SEND DATA LENGTH :' + this.dataLength);
                            this.buffer = '';
                        } else {
                            log.error('Unsupported command ' + cmd + ' : ' + this.buffer);
                        }
                    }
                }
                this.buffer = '';

            }
        }
    }
}