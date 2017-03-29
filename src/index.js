import App from './app';

const mode = process.env.NODE_ENV || 'production';

console.log(`Starting app in ${mode} mode.`);

switch (mode) {
    case 'test': break;
    case 'development': {
        new App({mqttHost: 'test.mosquitto.org',mqttPort: 1883,topic: 'phev/papawattu',vehicleHost: 'localhost',vehiclePort: 8080});
        break;
    }
    default: {
        new App({mqttHost: 'ubuntu.wattu.com',mqttPort: 8888,topic: 'phev/papawattu',vehicleHost: '192.168.1.46',vehiclePort: 8080});
    }
    
}