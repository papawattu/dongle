import chai from 'chai';
import sinon from 'sinon';
import MqttClient from './mqtt_client';
import chaiAsPromised from 'chai-as-promised';
 
chai.use(chaiAsPromised);

const assert = chai.assert;
const handler = {};
const mqtt = {};
const client = {};
const topic = 'topic';
const host = 'host';
const port = 8080;
const receive = sinon.spy();
const cb = sinon.spy();
client.publish = sinon.spy();
client.on = sinon.stub();
client.subscribe = sinon.spy();
mqtt.connect = sinon.stub().returns(client);

const sut = new MqttClient({topic,host,port,mqtt,receive});

describe('MQTT client', () => {
	beforeEach(() => {
			
    });
	it('Should not be null', () => {
		assert.isNotNull(sut);
	});
    it('Should connect', () => {
		client.on.withArgs('connect');
		sut.connect(cb);
		client.on.withArgs('connect').yield();
        assert(mqtt.connect.calledOnce);
        assert(client.on.calledThrice);
	});
    it('Should subscribe on connection', () => {
	    assert(client.subscribe.calledWith(topic));
	});
	it('Should send', () => {
		sut.send('Hello');
        assert(client.publish.calledOnce);
        assert(client.publish.calledWith(topic,'Hello'));
	});
    it('Should receive', () => {
        client.on.withArgs('message').yield('Again');
        assert(receive.calledWith('Again'));
	});
});
