import SIM900 from './SIM900/SIM900';
import Adapter from './adapter/adapter';
import PhevWifi from './adapter/phev_wifi';
import Wifi from 'Wifi';

Serial1.setup(115200, { path: '/dev/ttyS0' });

const wifi = new PhevWifi({
	wifi: Wifi,

});

const adapter = new Adapter({
	sim900: SIM900,
	serial: Serial1,
	apn: 'everywhere',
	username: 'eesecure',
	password: 'secure',
	wifi: wifi,
}).connect();

