export default class MqttClient {
  constructor({ topic, host, port, receive, mqtt }) {
    this.host = host;
    this.port = port;
    this.topic = topic;
    this.client = null;
    this.mqtt = mqtt;
    this.receive = receive;
  }
  connect(cb) {
    this.client = this.mqtt.connect({host: this.host, port: this.port});
    this.client.on('connect', () => {
      this.client.subscribe(this.topic);
      cb();
    });
    this.client.on('message', this.receive);
  }
  send(message) {
    if(this.client === null) throw Error('Not connected');
    this.client.publish(this.topic,message);
  }
}
