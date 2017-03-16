import chai from 'chai';
import sinon from 'sinon';
import CommandHandler from './command_handler';

const assert = chai.assert;

const writeCallback = sinon.spy();
const errorCallback = sinon.spy();
const sendCommand = sinon.stub().yields(Buffer.from([0x6f,0x04,0x01,0xaa,0x00,0x1e]));

const sut = new CommandHandler({
	writeCallback: writeCallback,
	errorCallback: errorCallback,
	sendCommand: sendCommand,
});

describe('Command Handler', () => {
	it('Should do bootstrap', () => {
		assert.isNotNull(sut);
	});
	it('Should handle send', () => {
		sut.handle('COMMAND 9kAAqgCk\r\n')
		assert(writeCallback.calledWith(Buffer.from([0x6f,0x04,0x01,0xaa,0x00,0x1e])));
	});
});