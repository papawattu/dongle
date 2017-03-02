import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import * as log from 'winston';
import WanAdapter from './wan_adapter';

const assert = chai.use(chaiAsPromised).assert;
chai.use(chaiAsPromised);

//log.remove(log.transports.Console);

const sim900 = {};
const socket = {};
const wifi = {};
const serial = {};

socket.write = sinon.spy();
sim900.connect = sinon.stub();
const connected = sinon.spy();
		
const sut = new WanAdapter({
	serial: serial,
	sim900: sim900,
	apn: 'apn', 
	username: 'username',
	password: 'password',
	serverHost: 'host',
	serverPort: 1234,
	serialNum: '1234' });

describe('Command Handler', () => {
	it('Should do bootstrap', () => {
		assert.isNotNull(sut);
	});
	it('Should do connect to wan', () => {
		const gprs = {};
		gprs.connect = sinon.stub().yields();
		sim900.connect = sinon.stub().returns(gprs);
		sinon.stub().yields();
		sut.connect();
		assert(sim900.connect.calledOnce);
		assert(sim900.connect.calledWith(serial));
		
	});
	
	it('Should do CONNECT', () => {
		sut.wanSocket = socket;
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
	it.skip('Should called connected callback', () => {
		sut.handle('OK\r\n');
		assert(connected.calledOnce);
		assert(connected.calledWith({ssid: 'abcd',password: 'abcd',host: 'abcd',port: '1234'}));
	});
});