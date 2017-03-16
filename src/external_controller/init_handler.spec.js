import chai from 'chai';
import sinon from 'sinon';
import InitHandler from './init_handler';

const assert = chai.assert;

const writeCallback = sinon.spy();
const readyCallback = sinon.spy();
const errorCallback = sinon.spy();

const sut = new InitHandler({
	serverHost: 'host',
	serverPort: 1234,
	serialNum: '1234',
	writeCallback: writeCallback,
	readyCallback: readyCallback,
	errorCallback: errorCallback,
});

describe('Command Handler', () => {
	it('Should do bootstrap', () => {
		assert.isNotNull(sut);
	});
	it('Should handle HELLO PHEV', () => {
		sut.handle('HELLO PHEV\r\n');
		assert(writeCallback.calledOnce);
		assert(writeCallback.calledWith('CONNECT 1234\r\n'));
	});
	it('Should do SSID', () => {
		sut.handle('OK\r\n');
		assert(writeCallback.calledWith('SSID\r\n'));
	});
	it('Should do PASSWORD', () => {
		sut.handle('SSID abcd\r\n');
		assert(writeCallback.calledWith('PASSWORD\r\n'));
	});
	it('Should do HOST', () => {
		sut.handle('PASSWORD abcd\r\n');
		assert(writeCallback.calledWith('HOST\r\n'));
	});
	it('Should do HOST', () => {
		sut.handle('PASSWORD abcd\r\n');
		assert(writeCallback.calledWith('HOST\r\n'));
	});
	it('Should do READY', () => {
		sut.handle('HOST abcd 1234\r\n');
		assert(writeCallback.calledWith('READY\r\n'));
	});
	it('Should do call ready callback', () => {
		sut.handle('OK\r\n');
		assert(readyCallback.calledOnce);
	});
	it('Should handle unregistered', () => {
		sut.state = 'CONNECT';
		sut.handle('NOT REGISTERED\r\n');
		assert(errorCallback.calledOnce);
		assert(errorCallback.calledWith('NOT REGISTERED'));
		assert.equal(sut.state,'INITIAL')
	});
});