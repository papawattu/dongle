import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import * as log from 'winston';


import Sim900Stub from './sim900stub';

const assert = chai.use(chaiAsPromised).assert;
chai.use(chaiAsPromised);

log.remove(log.transports.Console);

let stub = null;

describe('Stub', () => {
	beforeEach(() => {
		stub = new Sim900Stub({ host: 'localhost', port: 2222 });
		stub.socket = {};
		stub.socket.write = sinon.spy();
		stub.isData = false;
	});
	it('Should do bootstrap', () => {
		assert.isNotNull(stub);
	});
	it('Should return ok', () => {
		assert.equal(stub.ok(), 'OK');
	});
	it('Should respond', () => {
		stub.respond('1234');
		assert(stub.socket.write.calledWith('1234\r\n'));
	});
	it('Shoud strip off CRLR', () => {
		assert.equal(stub.stripCommand('1234\r\n'),'1234'); 
	});
	it('Should handle ATE', () => {

		stub.handler('ATE0\r\n');

		assert(stub.socket.write.called, 'socket write should be called');
		assert(stub.socket.write.calledWith('OK\r\n'), 'should return OK');
	});
	it('Should fail ATE without CRLF', () => {

		stub.handler('ATE0');
		assert.isNotTrue(stub.socket.write.called, 'socket write should not be called');
	});
	it('Should handle AT+CPIN?', () => {

		stub.handler('AT+CPIN?\r\n');

		assert(stub.socket.write.called, 'socket write should be called');
		assert(stub.socket.write.calledWith('OK\r\n'), 'should return OK');
	});
	it('Should handle AT+CGATT=1', () => {

		stub.handler('AT+CGATT=1\r\n');

		assert(stub.socket.write.called, 'socket write should be called');
		assert(stub.socket.write.calledWith('OK\r\n'), 'should return OK');
	});
	it('Should handle AT+CIPSHUT', () => {

		stub.handler('AT+CIPSHUT\r\n');

		assert(stub.socket.write.called, 'socket write should be called');
		assert(stub.socket.write.calledWith('SHUT OK\r\n'), 'should return SHUT OK');
	});
	it('Should handle AT+CIPSTATUS', () => {

		stub.handler('AT+CIPSTATUS\r\n');

		assert(stub.socket.write.called, 'socket write should be called');
		assert(stub.socket.write.calledWith('STATE: IP INITIAL\r\n'), 'should return STATE: IP INITIAL');
	});
	it('Should handle AT+CIPMUX=1', () => {

		stub.handler('AT+CIPMUX=1\r\n');

		assert(stub.socket.write.called, 'socket write should be called');
		assert(stub.socket.write.calledWith('OK\r\n'), 'should return OK');
	});
	it('Should handle AT+CIPHEAD=1', () => {

		stub.handler('AT+CIPHEAD=1\r\n');

		assert(stub.socket.write.called, 'socket write should be called');
		assert(stub.socket.write.calledWith('OK\r\n'), 'should return OK');
	});
	it('Should handle AT+CSTT', () => {

		stub.handler('AT+CSTT="everywhere", "eesecure", "secure"\r\n');

		assert(stub.socket.write.called, 'socket write should be called');
		assert(stub.socket.write.calledWith('OK\r\n'), 'should return OK');
	});
	it('Should handle AT+CIICR', () => {

		stub.handler('AT+CIICR\r\n');

		assert(stub.socket.write.called, 'socket write should be called');
		assert(stub.socket.write.calledWith('OK\r\n'), 'should return OK');
	});
	it('Should handle AT+CIFSR', () => {

		stub.handler('AT+CIFSR\r\n');

		assert(stub.socket.write.called, 'socket write should be called');
		assert(stub.socket.write.calledWith('1.1.1.1\r\n'), 'should return 1.1.1.1');
	});
	it('Should send data', () => {
		const testData = 'test data';

		stub.sendData(testData);
		assert(stub.socket.write.called, 'socket write should be called');
		assert(stub.socket.write.calledWith('+RECEIVE,0,' + testData.length + ':\r\n' + testData), 'should write test data');

	});
	it('Should handle AT+CIPSEND', () => {
		const testData = 'AT+CIPSEND=0,4\r\n'
		stub.handler(testData);
		assert(stub.socket.write.called, 'socket write should be called');
		assert(stub.socket.write.calledWith('\r\n>'), 'should write > ');
		assert.isTrue(stub.isData);
		assert.equal(stub.dataLength,4);
	});
	it('Should handle data being sent', () => {
		const testData = 'OK\r\n';
		stub.isData = true;
		stub.dataLength = 4;
		stub.handleData(testData);
		assert(stub.socket.write.called, 'socket write should be called');
		assert(stub.socket.write.calledWith('0, SEND OK\r\n'), 'should write 0, SEND OK');

	});
});