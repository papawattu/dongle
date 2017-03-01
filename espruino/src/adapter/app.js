import Adapter from './adapter';
import PhevWifi from './phev_wifi';
import CommandHandler from './command_handler'

export default class App {
	constructor({wifi, serial,sim900,serialNum}) {
		this.adapter = new Adapter({
			sim900: sim900,
			serial: serial,
			apn: 'everywhere',
			username: 'eesecure',
			password: 'secure',
		}).connect((socket) => {			
			const commandHandler = new CommandHandler(
				{
					socket: socket,
					serialNum: serialNum, 
					connected: (config) => {
						const phevWifi = new PhevWifi(wifi,config);
						phevWifi.start(()=> {
							this.phevWifi.connect();
						});
					}
				}); 
		});
	}
}
