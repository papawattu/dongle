import PhevWifi from './phev_wifi';

export default class CommandHandler {
    constructor({socket, serialNum, connected}) {
        this.socket = socket;
        this.state = 'INITIAL';
        this.buffer = '';
        this.serialNum = serialNum;
        this.ssid = null;
        this.password = null;
        this.host = null;
        this.port = null;
        this.connected = connected;
    }
    stripCommand(data) {
        return data.substr(0, data.indexOf('\r'));
    }
    handle(data) {
        this.buffer += data;
        if(this.buffer.indexOf('\r') < 0) {
            return;
        }
        const cmd = this.stripCommand(this.buffer).split(' ');
        console.log('COMMAND ' + cmd[0] + ' : buffer ' + this.buffer);
        this.buffer = '';
        switch (this.state) {
            case 'INITIAL': {
                if(cmd[0] === 'HELLO' && cmd[1] === 'PHEV') {
                    this._connect();
                    this.state = 'CONNECT';
                }
                break;
            }
            case 'CONNECT': {
                if(cmd[0] === 'OK') {
                    this._ssid();
                    this.state = 'SSID';
                } else {
                    this.state = 'NOT REGISTERED';
                }
                break;
            }
            case 'SSID': {
                if(cmd[0] === 'SSID') {
                    this.ssid = cmd[1];
                    this._password();
                    this.state = 'PASSWORD';
                }
                break;
            }
            case 'PASSWORD': {
                if(cmd[0] === 'PASSWORD') {
                    this.password = cmd[1];
                    this._host();
                    this.state = 'HOST';
                }
                break;
            }
            case 'HOST': {
                if(cmd[0] === 'HOST') {
                    this.host = cmd[1];
                    this.port = cmd[2];
                    this._ready();
                    this.state = 'READY';
                } 
                break;
            }
            case 'READY': {
                if(cmd[0] === 'OK') {
                    console.log('PHEV ready for commands');
                    this.connected({ssid: this.ssid,
                        password: this.password,
                        host: this.host,
                        port: this.port,
                    });
                }
                break;
            }
            default: {
                this.state = 'UNKNOWN';
            }
        }
    }
    respond(data) {
        console.log('SENDING : ' + data);
        this.socket.write(data + '\r\n');
    }
    _connect() {
        this.respond('CONNECT ' + this.serialNum); 
    }
    _ssid() {
        this.respond('SSID');
    }
    _password() {
        this.respond('PASSWORD');
    }
    _host() {
        this.respond('HOST');
    }
    wifiOn() {
        this.respond('WIFION');
    }
    wifiError() {
        this.respond('WIFIERROR');
    }
    _ready() {
        this.respond('READY');
    }
}