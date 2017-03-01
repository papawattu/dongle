import net from 'net';

const EOL = '\r\n';
const counter = 0;
const connected = 0;

export default class Adapter {
	constructor({serial, sim900, apn, username, password}) {
		this.serial = serial;
		this.sim900 = sim900;
		this.apn = apn;
		this.ip = null;
		this.username = username;
		this.password = password;
		this.gprsSocket = null;
		this.gprs = null;
		this.wifi = wifi;
	}
	connect(cb) {
		this.gprs = this.sim900.connect(this.serial, undefined, (err) => {
			if (err) throw err;
			this.gprsSocket = this.gprs.connect(this.apn, this.username, this.password, (err) => {
				if (err) throw err;
				this.gprs.getIP((err, ip) => {
					this.ip = ip;
					if (err) throw err;
					cb(this.gprsSocket);
				}); 
			});
		});
	}
}