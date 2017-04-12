import chai from 'chai';
import sinon from 'sinon';
import Dispatcher from './dispatcher';
import chaiAsPromised from 'chai-as-promised';
 
chai.use(chaiAsPromised);

const assert = chai.assert;
const client = {};

client.send = sinon.spy();

describe('Dispatcher', () => {
	beforeEach(() => {
			
    });
	it('Should send "CONNECTED" at start', () => {
		Dispatcher.start(client,'1234');
		assert(client.send.calledWith('CONNECTED 1234'));
	});
	it('Should handle send', () => {
		const result = Dispatcher.incoming(Buffer.from('SEND SmFtaWU='));
		assert.equal(result,'Jamie');
	});
	it('Should handle receive', () => {
		const result = Dispatcher.outgoing(Buffer.from('Nuttall'));
		assert.equal(result,'RECEIVED TnV0dGFsbA==');
	});
    it('Should handle ping', () => {
        const result = Dispatcher.incoming(Buffer.from('PING 1'));
        assert.deepEqual(result,Buffer.from([0xf9,0x04,0x00,0x01,0x00,0xfe]));
    });
});
