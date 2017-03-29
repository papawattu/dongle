import net from 'net';
import mqtt from 'mqtt';

import MqttClient from './mqtt/mqtt_client';
import Dispatcher from './vehicle/dispatcher';
import VehicleClient from './vehicle/client';

export default class App {
    constructor({mqttHost,mqttPort,topic,vehicleHost,vehiclePort}) {

        this.mqttClient = new MqttClient({topic,host: mqttHost, port: mqttPort, receive: this.mqttReceive.bind(this),mqtt});
        this.vehicleClient = new VehicleClient({host: vehicleHost,port: vehiclePort, receive: this.vehicleReceive.bind(this),net});

        this.mqttClient.connect(() => {
            this.vehicleClient.connect(() => {
                Dispatcher.start(this.mqttClient);
            });
        });
        
    }
    mqttReceive(topic,message) {
        const cmd = Dispatcher.incoming(message);
        if(cmd != null) {
            this.vehicleClient.send(cmd);
        }
    }
    vehicleReceive(message) {
        this.mqttClient.send(Dispatcher.outgoing(message));
    }
}
