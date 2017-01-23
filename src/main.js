import SIM900  from './SIM900/SIM900';
import Adapter from './adapter/adapter';

Serial1.setup(115200,{path: SERIAL_DEV});

const adapter = new Adapter({sim900: SIM900,
	serial: Serial1, 
	apn: 'everywhere',
	username: 'eesecure',
	password: 'secure'});