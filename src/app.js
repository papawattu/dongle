git config --global http.proxy import net from 'net';
import mqtt from 'mqtt';

import MqttClient from './mqtt/mqtt_client';
import Dispatcher from './vehicle/dispatcher';
import VehicleClient from './vehicle/client';


export default class App {
    constructor({mqttHost,mqttPort,topic,vehicleHost,vehiclePort}) {
        console.log(`MQTT host       ${mqttHost} port ${mqttPort}
Topic           ${topic}
Vehicle Host    ${vehicleHost} port ${vehiclePort}`);

        this.mqttClient = new MqttClient({topic,host: mqttHost, port: mqttPort, receive: this.mqttReceive.bind(this),mqtt});
        this.vehicleClient = new VehicleClient({host: vehicleHost,port: vehiclePort, receive: this.vehicleReceive.bind(this),net});

        this.mqttClient.connect(() => {
            Dispatcher.start(this.mqttClient);
        });
        
    }
    mqttReceive(topic,message) {
        const cmd = Dispatcher.incoming(message);
        if(cmd != null) {
            this.vehicleClient.connect(() => {
                this.vehicleClient.send(cmd);
            });
        }
    }
    vehicleReceive(message) {
        console.log(message.toString('hex'));
        this.mqttClient.send(Dispatcher.outgoing(message));
    }
}
