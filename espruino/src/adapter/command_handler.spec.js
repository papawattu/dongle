import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import * as log from 'winston';
import CommandHandler from './command_handler';

const assert = chai.use(chaiAsPromised).assert;
chai.use(chaiAsPromised);

//log.remove(log.transports.Console);

const socket = {};
const wifi = {};

socket.write = sinon.spy();

const connected = sinon.spy();
		
const sut = new CommandHandler({socket, serialNum: '1234', connected});

describe('Command Handler', () => {
	it('Should do bootstrap', () => {
		assert.isNotNull(sut);
	});
	it('Should do CONNECT', () => {
		sut.handle('HELLO PHEV\r\n');
		assert(socket.write.calledOnce);
		assert(socket.write.calledWith('CONNECT 1234\r\n'));
	});
	it('Should do SSID', () => {
		sut.handle('OK\r\n');
		assert(socket.write.calledWith('SSID\r\n'));
	});
	it('Should do PASSWORD', () => {
		sut.handle('SSID abcd\r\n');
		assert(socket.write.calledWith('PASSWORD\r\n'));
	});
	it('Should do HOST', () => {
		sut.handle('PASSWORD abcd\r\n');
		assert(socket.write.calledWith('HOST\r\n'));
	});
	it('Should do READY', () => {
		sut.handle('HOST abcd 1234\r\n');
		assert(socket.write.calledWith('READY\r\n'));
	});
	it('Should called connected callback', () => {
		sut.handle('OK\r\n');
		assert(connected.calledOnce);
		assert(connected.calledWith({ssid: 'abcd',password: 'abcd',host: 'abcd',port: '1234'}));
	});
});