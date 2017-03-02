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
const net = {};
const ready = sinon.spy();
		
socket.write = sinon.spy();
socket.on = sinon.spy();

sim900.connect = sinon.stub().yields();
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
		net.connect = sinon.stub().yields(socket);
		gprs.connect = sinon.stub().yields();
		sut.sim900.connect = sinon.stub().returns(gprs);
		
		sut.connect(net,{connected: ()=>{
			assert(sim900.connect.calledOnce);
			assert(sim900.connect.calledWith(serial));
		}, ready: ready});
		sim900.connect.yield();		
	});
	it('Should do CONNECT', (done) => {
		const gprs = {};
		net.connect = sinon.stub().yields(socket);
		gprs.connect = sinon.stub().yields();
		sut.sim900.connect = sinon.stub().returns(gprs);
		
		sut.connect(net,{connected: () => {
			assert(sim900.connect.calledOnce);
			assert(sim900.connect.calledWith(serial));
			done();
		},ready: ready});
		sim900.connect.yield();
		sut.wanSocket.on.yield('CONNECT 1234\r\n');
	});
	it('Should handle HELLO PHEV', () => {
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
	it('Should called connected callback', () => {
		sut.handle('OK\r\n');
		assert(sut.callback.ready.calledWith({ssid: 'abcd',password: 'abcd',host: 'abcd',port: '1234'}));
	});
});