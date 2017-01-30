import PhevWifi from './phev_wifi';

export default class CommandHandler {
    constructor({socket, wifi}) {
        this.socket = socket;
        this.state = 'INITIAL';
        this.phevWifi = wifi;
    }
    stripCommand(data) {
        return data.substr(0, data.indexOf('\r'));
    }
    handle(data) {
        const cmd = this.stripCommand(data).split(' ');
        console.log('COMMAND ' + cmd[0] + ' : data ' + data);
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
                    this.state = 'PASSWORD';
                }
                break;
            }
            case 'PASSWORD': {
                if(cmd[0] === 'PASSWORD') {
                    this.phevWifi.setPassword(cmd[1]);
                    this.phevWifi.start((err) => {
                        this.state = 'HOST';
                        this.wifiOn();
                    });
                }
                break;
            }
            case 'HOST': {
                if(cmd[0] === 'HOST') {
                    this.phevWifi.setHost(cmd[1]);
                    this.phevWifi.setPort(cmd[2]);
                    this.phevWifi.connect((err) =>{ 
                        if(err) {
                            this.wifiError();
                        } 
                        this.vin = this.wifiOn();
                        this.state = 'READY';
                    });
                } else {
                    this.state = 'UNKNOWN';
                }
                break;
            }
            default: {
                this.state = 'UNKNOWN';
            }
        }
    }
    respond(data) {
        this.socket.write(data + '\r\n');
    }
    connect() {
        this.respond('CONNECT ' + process.env.SERIAL); 
    }
    ssid() {
        this.respond('SSID');
    }
    wifiOn() {
        this.respond('WIFION');
    }
    wifiError() {
        this.respond('WIFIERROR');
    }
}