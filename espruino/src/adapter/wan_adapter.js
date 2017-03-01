import net from 'net';

const EOL = '\r\n';
const counter = 0;
const connected = 0;

export default class WanAdapter {
	constructor({serial,
		sim900,
		apn,
		username,
		password,
		serialNum,
		serverHost,
		serverPort}) {
		this.serverHost = serverHost;
		this.serverPort = serverPort;
		
		this.vehicleHost = null;
		this.vehiclePort = null;
		
		this.serial = serial;
		this.sim900 = sim900;
		this.apn = apn;
		this.username = username;
		this.password = password;

		this.wanSocket = null;
		this.gprs = null;
		
		this.state = 'INITIAL';
        this.buffer = '';
        this.serialNum = serialNum;
        this.ssid = null;
           
	}
	_connectToServer(net) {
		net.connect({host: this.serverHost, port: this.serverPort}, (socket) => {
			this.wanSocket = socket;
			this.wanSocket.on(data,this.handle.bind(this));	
		});
	}
	_connectToAPN(gprs) {
		gprs.connect(this.apn, this.username, this.password, (err) => {
			if (err) throw err;
			this._connectToServer(net);	
		});
	}
	connect(cb) {
		const gprs = this.sim900.connect(this.serial, undefined, (err) => {
			if (err) throw err;
			_this.connectToAPN(gprs);
		});
	}
	stripCommand(data) {
		return data.substr(0, data.indexOf('\r'));
	}
	handle(data) {
		this.buffer += data;
		if (this.buffer.indexOf('\r') < 0) {
			return;
		}
		const cmd = this.stripCommand(this.buffer).split(' ');
		console.log('COMMAND ' + cmd[0] + ' : buffer ' + this.buffer);
		this.buffer = '';
		switch (this.state) {
			case 'INITIAL': {
				if (cmd[0] === 'HELLO' && cmd[1] === 'PHEV') {
					this._connect();
					this.state = 'CONNECT';
				}
				break;
			}
			case 'CONNECT': {
				if (cmd[0] === 'OK') {
					this._ssid();
					this.state = 'SSID';
				} else {
					this.state = 'NOT REGISTERED';
				}
				break;
			}
			case 'SSID': {
				if (cmd[0] === 'SSID') {
					this.ssid = cmd[1];
					this._password();
					this.state = 'PASSWORD';
				}
				break;
			}
			case 'PASSWORD': {
				if (cmd[0] === 'PASSWORD') {
					this.password = cmd[1];
					this._host();
					this.state = 'HOST';
				}
				break;
			}
			case 'HOST': {
				if (cmd[0] === 'HOST') {
					this.vehicleHost = cmd[1];
					this.vehiclePort = cmd[2];
					this._ready();
					this.state = 'READY';
				}
				break;
			}
			case 'READY': {
				if (cmd[0] === 'OK') {
					console.log('PHEV ready for commands');
					this.connected({
						ssid: this.ssid,
						password: this.password,
						host: this.vehicleHost,
						port: this.vehiclePort,
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
		this.wanSocket.write(data + '\r\n');
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