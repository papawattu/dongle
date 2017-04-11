import chai from 'chai';
import sinon from 'sinon';
import Incoming from './incoming';

const assert = chai.assert;

const net = {};
const socket = {};
const server = {};
const outgoing = {};

server.listen = sinon.stub();
server.on = sinon.stub();
net.createServer = sinon.stub().returns(server);
socket.on = sinon.stub();
socket.write = sinon.spy();
outgoing.send = sinon.stub();

const sut = new Incoming({port: 8081, net: net,outgoing: outgoing});

describe('Bridge', () => {
	beforeEach(() => {
			
    });
	it('Should not be null', () => {
		assert.isNotNull(sut);
	});
	it('Should start server',(done) => {
		sut.startServer((err) => {
			assert.ifError(err);
			assert.isTrue(net.createServer.calledOnce);
			done();
		});
		net.createServer.yield(socket);
		server.listen.yield();
	});
	it('Should forward requests',() => {
		socket.on.yield('1234');

		assert(outgoing.send.calledWith('1234'),'Expected to call outgoing.send with 1234.');
	});
	it('Should forward replies',() => {
		sut.send('1234');

		assert(socket.write.calledWith('1234'),'Expected to write 1234 to socket.');
	});
	
});