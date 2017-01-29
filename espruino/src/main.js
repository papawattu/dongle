import SIM900 from './SIM900/SIM900';
import Adapter from './adapter/adapter';
import Wifi from 'wifi';

Serial1.setup(115200, { path: '/dev/ttyS0' });

const wifi = new PhevWifi({
	wifi : Wifi
});

const adapter = new Adapter({
	sim900: SIM900,
	serial: Serial1,
	apn: 'everywhere',
	username: 'eesecure',
	password: 'secure',
	wifi: wifi.socket,
}).connect();

