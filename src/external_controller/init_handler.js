
const EOL = '\r\n';
const counter = 0;
const connected = 0;

export default class InitHandler {
	constructor({ 
		serialNum,
		serverHost,
		serverPort,
	 	writeCallback,
		readyCallback,
		errorCallback,
	}) {
		this.readyCallback = readyCallback;
		this.writeCallback = writeCallback;
		this.errorCallback = errorCallback;
		this.serverHost = serverHost;
		this.serverPort = serverPort;
		this.state = 'INITIAL';
		this.buffer = '';
		this.serialNum = serialNum;
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
					this.connectResponse();
					this.state = 'CONNECT';
				}
				break;
			}
			case 'CONNECT': {
				if (cmd[0] === 'OK') {
					this.ssidResponse();
					this.state = 'SSID';
				} else {
					this.state = 'INITIAL';
					this.errorCallback('NOT REGISTERED');
				}
				break;
			}
			case 'SSID': {
				if (cmd[0] === 'SSID') {
					this.ssid = cmd[1];
					this.passwordResponse();
					this.state = 'PASSWORD';
				}
				break;
			}
			case 'PASSWORD': {
				if (cmd[0] === 'PASSWORD') {
					this.password = cmd[1];
					this.hostResponse();
					this.state = 'HOST';
				}
				break;
			}
			case 'HOST': {
				if (cmd[0] === 'HOST') {
					if(cmd.length !== 1) {
						this.vehicleHost = cmd[1];
						this.vehiclePort = cmd[2];
					}
					this.readyResponse();
					this.state = 'READY';
				}
				break;
			}
			case 'READY': {
				if (cmd[0] === 'OK') {
					console.log('PHEV ready for commands');
					this.state = 'WAITING';
					this.readyCallback();
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
		this.writeCallback(data + '\r\n');
	}
	connectResponse() {
		this.respond('CONNECT ' + this.serialNum);
	}
	ssidResponse() {
		this.respond('SSID');
	}
	passwordResponse() {
		this.respond('PASSWORD');
	}
	hostResponse() {
		this.respond('HOST');
	}
	wifiOnResponse() {
		this.respond('WIFION');
	}
	wifiErrorResponse() {
		this.respond('WIFIERROR');
	}
	readyResponse() {
		this.respond('READY');
	}
}