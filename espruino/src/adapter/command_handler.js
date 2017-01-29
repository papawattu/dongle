export default class CommandHandler {
    constructor({socket, vin, wifi}) {
        this.socket = socket;
        this.state = 'INITIAL';
        this.vin = vin;
        this.phevWifi = new PhevWifi(wifi);
    }
    stripCommand(data) {
        return data.substr(0, data.indexOf('\r'));
    }
    handle(data) {
        const cmd = stripCommand(data).split(' ');

        switch (this.state) {
            case 'INITIAL': {
                if(cmd[0] === 'HELLO PHEV') {
                    connect();
                    this.state = 'CONNECT';
                }
                break;
            }
            case 'CONNECT': {
                if(cmd[0] === 'OK') {
                    ssid();
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
                    this.phevWifi.start()
                    this.state = 'WIFION';
                }
            }
        }
    }
    respond(data) {
        this.socket.write(data + '\r\n');
    }
    connect() {
        this.respond('CONNECT ' + this.vin); 
    }
    ssid() {
        this.respond('SSID');
    }
}