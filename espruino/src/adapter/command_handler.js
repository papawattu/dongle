import PhevWifi from './phev_wifi';

export default class CommandHandler {
    constructor({socket, wifi}) {
        this.socket = socket;
        this.state = 'INITIAL';
        this.phevWifi = wifi;
        this.buffer = '';
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
                    this.connect();
                    this.state = 'CONNECT';
                }
                break;
            }
            case 'CONNECT': {
                if(cmd[0] === 'OK') {
                    this.ssid();
                    this.state = 'SSID';
                } else {
                    this.state = 'NOT REGISTERED';
                }
                break;
            }
            case 'SSID': {
                if(cmd[0] === 'SSID') {
                    this.phevWifi.setSSID(cmd[1]);
                    this.password();
                    this.state = 'PASSWORD';
                }
                break;
            }
            case 'PASSWORD': {
                if(cmd[0] === 'PASSWORD') {
                    this.phevWifi.setPassword(cmd[1]);
                    this.phevWifi.start((err) => {
                        this.state = 'WIFION';
                        this.wifiOn();
                    });
                }
                break;
            }
            case 'WIFION': {
                if(cmd[0] === 'OK') {
                    this.host();
                    this.state = 'HOST';
                }
            }
            case 'HOST': {
                if(cmd[0] === 'HOST') {
                    this.phevWifi.setHost(cmd[1]);
                    this.phevWifi.setPort(cmd[2]);
                    this.phevWifi.connect((err) =>{ 
                        if(err) {
                            this.wifiError();
                            this.state = 'WIFIERROR';
                            return;    
                        } else {
                            this.ready();
                            this.state = 'READY';
                        }
                    });
                } 
                break;
            }
            case 'READY': {
                if(cmd[0] === 'OK') {
                    console.log('PHEV ready for commands');
                }
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
    connect() {
        this.respond('CONNECT ' + process.env.SERIAL); 
    }
    ssid() {
        this.respond('SSID');
    }
    password() {
        this.respond('PASSWORD');
    }
    host() {
        this.respond('HOST');
    }
    wifiOn() {
        this.respond('WIFION');
    }
    wifiError() {
        this.respond('WIFIERROR');
    }
    ready() {
        this.respond('READY');
    }
}