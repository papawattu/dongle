import WanAdapter from './wan_adapter';
import PhevWifi from './phev_wifi';
import net from 'net';

export default class App {
	constructor({ serial, sim900, serialNum }) {
		this.wanAdapter = new WanAdapter({
			sim900: sim900,
			serial: serial,
			serialNum: serialNum,
			apn: 'everywhere',
			username: 'eesecure',
			password: 'secure',
			serverHost: 'localhost',
			serverPort: '1974',
			net: net,
		});

		//this.wifiAdapter = new WifiAdapter(wifi);
		this.wanAdapter.connect(
			{
				connected: (socket) => {
					console.log('Connected');
				}, ready: (details) => {
					console.log('details ssid ' + details.ssid + ' password ' + details.password);
				}, error: (err) => {

				}
			});
	}
}
