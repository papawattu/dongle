import chai from 'chai';
import sinon from 'sinon';
import Outgoing from './outgoing';

const assert = chai.assert;

const net = {};
const socket = {};
net.connect = sinon.stub().returns(socket);
socket.on = sinon.spy();
socket.write = sinon.spy();
const receive = sinon.stub();

const sut = new Outgoing({host: 'localhost',port: 8080, net: net,receive: receive});

describe('Outgoing', () => {
	beforeEach(() => {
			
    });
	it('Should not be null', () => {
		assert.isNotNull(sut);
	});
	it('Should connect to car',(done) => {
		sut.connect((err)=>{
			assert.ifError(err);
			assert.isTrue(net.connect.calledOnce);
			done();
		});
		net.connect.yield();
	});
	it('Should forward incoming requests to the car',() => {
		sut.send('1234');

		assert(socket.write.calledWith('1234'));
	});
	it('Should forward incoming resposes back',() => {
		socket.on.yield('1234');

		assert(receive.calledWith('1234'));
	});
});