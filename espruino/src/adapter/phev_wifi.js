import net from 'net';

export default class PhevWifi {
    constructor(wifi) {
        this.ssid = null;
        this.password = null;
        this.wifi = wifi;
        this.socket = null;
    }
    setSSID(ssid) {
        this.ssid = ssid;
    }
    setPassword(password) {
        this.password = password;
    }
    start() {
        this.socket = net.connect({host: HOST, port: PORT},()=> {

        });
        this.socket.on('data', (data) => {
            
        });
    }

}