import App from './adapter/app';
import Wifi from 'Wifi';
import SIM900 from './SIM900/SIM900';


Serial1.setup(115200, { path: '/dev/ttyS0' });

const app = new App({ wifi: Wifi, 
    serial: Serial1, 
    sim900: SIM900, 
    serialNum: process.env.SERIAL });