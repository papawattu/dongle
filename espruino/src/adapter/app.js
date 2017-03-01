import WanAdapter from './wan_adapter';
import PhevWifi from './phev_wifi';

export default class App {
	constructor({serial,sim900,serialNum}) {
		this.wanAdapter = new WanAdapter({
			sim900: sim900,
			serial: serial,
			serialNum: serialNum,
			apn: 'everywhere',
			username: 'eesecure',
			password: 'secure',
			serverHost: 'localhost',
			serverPort: '1974',
		});
		
		//this.wifiAdapter = new WifiAdapter(wifi);
		

		
		
		this.wanAdapter.connect((socket) => {			
			const commandHandler = new Dialer({
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
