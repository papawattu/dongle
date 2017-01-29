import net from 'net';
import * as log from 'winston';
import retry from 'retry';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 2222;


export default class Sim900Stub {
    constructor({ host = HOST, port = PORT }) {
        this.socket = null;
        this.host = host;
        this.port = port;
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
            log.info('Trying to connect to ' + this.host + ':' + this.port + ' attempt #' + attempt);

            this.socket = net.connect({ port: this.port, host: this.host }, () => {
                log.info('Connected');
            });
            this.socket.on('error', (err) => {
                attempt++;
                if (op.retry(err)) {
                    return;
                }
            });
            this.socket.on('data', this.handler.bind(this));
        });
    }
    respond(response) {
        log.info('RESPONSE : ' + response + '\r\n');
        this.socket.write(response + '\r\n');
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
        this.socket.write(d);
    }
    sendHelloPhev() {
        this.sendData('HELLO PHEV');
    }
    handleData(data) {
        this.buffer += data;
        if (this.buffer.length == this.dataLength) {
            log.info('RECEIVED DATA :' + this.buffer);
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
                const cmd = this.stripCommand(this.buffer);
                switch (cmd) {
                    case 'ATE0': this.respond(this.ok()); break;
                    case 'AT+CPIN?': this.respond(this.ok()); break;
                    case 'AT+CGATT=1': this.respond(this.ok()); break;
                    case 'AT+CIPSHUT': this.respond('SHUT OK'); break;
                    case 'AT+CIPSTATUS': this.respond('STATE: IP INITIAL'); break;
                    case 'AT+CIPMUX=1': this.respond(this.ok()); break;
                    case 'AT+CIPHEAD=1': this.respond(this.ok()); break;
                    case 'AT+CSTT="everywhere", "eesecure", "secure"': this.respond(this.ok()); break;
                    case 'AT+CIICR': this.respond(this.ok()); break;
                    case 'AT+CIFSR': this.respond('1.1.1.1'); break;
                    case 'AT+CIPSTART=0,"TCP","localhost",80': {
                        log.info('Connected to WAN');
                        this.connected = true;
                        this.respond(this.ok());
                        this.respond('0, CONNECT OK');
                        this.sendHelloPhev();
                        break;
                    }
                    default: {
                        if (this.buffer.indexOf('AT+CIPSEND=0,') >= 0) {
                            const len = this.buffer.indexOf('\r');
                            this.dataLength = this.buffer.substr(this.buffer.indexOf(',') + 1, len);
                            this.socket.write('\r\n>');
                            this.isData = true;
                            log.info('SEND DATA LENGTH :' + this.dataLength);
                            this.buffer = '';
                        } else {
                            log.error('Unsupported command ' + cmd + ' : ' + buffer);
                        }
                    }
                }
                this.buffer = '';

            }
        }
    }
}