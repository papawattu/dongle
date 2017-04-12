import App from './app';

const mode = process.env.NODE_ENV || 'production';
const mqttHost = process.env.MQTTHOST || 'jenkins.wattu.com';
const mqttPort = process.env.MQTTPORT || 1883;
const topic = process.env.TOPIC || 'phev/papawattu';
const vehicleHost = process.env.VEHICLEHOST || '192.168.8.46';
const vehiclePort = process.env.VEHICLEPORT || 8080;
const dongleId = process.env.DONGLE_ID || Math.floor(Math.random()*1000000);

console.log(`Started in ${mode} mode.`);
switch (mode) {
    case 'test': break;
    case 'development': {
        new App({mqttHost: 'test.mosquitto.org',mqttPort: 1883,topic: 'phev/papawattu',vehicleHost: 'localhost',vehiclePort: 8080,dongleId: 1234});
        break;
    }
    default: {
        new App({mqttHost: mqttHost,mqttPort: mqttPort,topic: topic, vehicleHost: vehicleHost,vehiclePort: vehiclePort,dongleId: dongleId});
    }
    
}