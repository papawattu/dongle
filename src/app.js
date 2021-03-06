import net from 'net';
import mqtt from 'mqtt';

import MqttClient from './mqtt/mqtt_client';
import Dispatcher from './vehicle/dispatcher';
import VehicleClient from './vehicle/client';


export default class App {
    constructor({mqttHost,mqttPort,topic,vehicleHost,vehiclePort,dongleId}) {
        console.log(`MQTT host       ${mqttHost} port ${mqttPort}
Topic           ${topic}
Vehicle Host    ${vehicleHost} port ${vehiclePort}
Dongle ID       ${dongleId}`);

        this.mqttClient = new MqttClient({topic,host: mqttHost, port: mqttPort, receive: this.mqttReceive.bind(this),mqtt});
        this.vehicleClient = new VehicleClient({host: vehicleHost,port: vehiclePort, receive: this.vehicleReceive.bind(this),net});

        this.vehicleClient.connect(() => {
            console.log('Connected to car');
        });
        this.mqttClient.connect((err) => {
            if(err) {
                throw err;
            }
            Dispatcher.start(this.mqttClient,dongleId);
        });
        
    }
    mqttReceive(topic,message) {
        const cmd = Dispatcher.incoming(message);
        if(cmd != null) {
            if(this.vehicleClient.socket == null) {
                this.vehicleClient.connect(() => {
                    this.vehicleClient.send(cmd);       
                });
            } else {
                if(!this.vehicleClient.socket.destroyed) {
                    this.vehicleClient.send(cmd);
                } else {
                    console.log('Socket destroyed');
                }
            }
        }
    }
    vehicleReceive(message) {
        console.log('Vehicle receive : ' + message.toString('hex'));
        this.mqttClient.send(Dispatcher.outgoing(message));
    }
}
