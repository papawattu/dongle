import net from 'net';
import CommandHandler from './command_handler'
const EOL = '\r\n';
const counter = 0;
const connected = 0;

export default class Adapter {
	constructor({serial, sim900, apn, username, password,host,port,wifi}) {
		this.serial = serial;
		this.sim900 = sim900;
		this.apn = apn;
		this.ip = null;
		this.username = username;
		this.password = password;
		this.host = host;
		this.port = port;
		this.socket = null;
		this.gprs = null;
		this.wifi = wifi;
	}
	connect() {
		this.gprs = this.sim900.connect(this.serial, undefined, (err) => {
			if (err) throw err;
			this.gprs.connect(this.apn, this.username, this.password, (err) => {
				if (err) throw err;
				this.gprs.getIP((err, ip) => {
					this.ip = ip;
					if (err) throw err;
					this.socket = net.connect({ host: this.host, port: this.port }, (res) => {
						this.commandHandler = new CommandHandler({socket: this.socket, wifi: this.wifi});
						res.on('data', this.commandHandler.handle.bind(this.commandHandler));
					});
				});
			});
		});
	}
}