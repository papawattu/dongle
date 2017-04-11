import chai from 'chai';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import App from './app';
 
chai.use(chaiAsPromised);

const assert = chai.assert;

const mqtt = {};

mqtt.connect = sinon.spy();
const sut = new App({mqttHost: 'localhost',mqttPort: 8888,vehicleHost: 'localhost', vehiclePort: 8888, mqtt});

describe('App', () => {
	beforeEach(() => {
			
    });
	it('Should not be null', () => {
		assert.isNotNull(sut);
	});
});