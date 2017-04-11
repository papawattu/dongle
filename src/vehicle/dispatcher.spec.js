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
		Dispatcher.start(client);
		assert(client.send.calledWith('CONNECTED'));
	});
	it('Should handle send', () => {
		const result = Dispatcher.incoming(Buffer.from('SEND SmFtaWU='));
		assert.equal(result,'Jamie');
	});
	it('Should handle receive', () => {
		const result = Dispatcher.outgoing(Buffer.from('Nuttall'));
		assert.equal(result,'RECEIVED TnV0dGFsbA==');
	});
});
