import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import * as log from 'winston';
import App from './app';

const assert = chai.use(chaiAsPromised).assert;
chai.use(chaiAsPromised);

//log.remove(log.transports.Console);

const serial = {};
const wifi = {};
const sim900 = {};

serial.write = sinon.spy();
serial.on = sinon.spy();
sim900.connect = sinon.spy();
		
const sut = new App({wifi,serial,sim900});

describe('Command Handler', () => {
	beforeEach(() => {
			
    });
	it('Should do bootstrap', () => {
		assert.isNotNull(sut);
	});
});

