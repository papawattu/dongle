import Sim900Stub from './sim900stub';
import CarSim from './carsim';

const HOST = process.env.HOST     || 'localhost';
const PORT = process.env.PORT || 2222;

//new Sim900Stub({host :HOST, port: PORT}).connect();

console.log(process.env.NODE_ENV);

if(process.env.NODE_ENV !== 'test') {

    new CarSim().start(()=> {
    
    });
}