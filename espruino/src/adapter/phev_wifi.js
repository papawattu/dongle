import net from 'net';

export default class PhevWifi {
    constructor(wifi,{ssid,password,host,port}) {
        this.ssid = null;
        this.password = null;
        this.wifi = wifi;
        this.socket = null;
        this.host = null;
        this.port = null;
        this.wifiConnected = false;
    }
    setSSID(ssid) {
        this.ssid = ssid;
    }
    setPassword(password) {
        this.password = password;
    }
    setHost(host) {
        this.host = host;
    }
    setPort(port) {
        this.port = port;
    }
    start(cb) {
        console.log('Starting WIFI');
        if(process.env.BOARD != 'LINUX') {
            this.socket = this.wifi.connect(this.ssid, {password: this.password}, (ap) => { 
                this.wifiConnected = true;
                cb();
            });
        } else {
            this.wifiConnected = true;
            cb();
        }
    }
    connect(cb) {
        console.log('Connection to PHEV Wifi : ' + this.host + ' : ' + this.port);
        this.socket = net.connect({host: this.host, port: this.port},()=> {
            cb();
        });
        this.socket.on('data', (data) => {
            
        });
    }
}