import chai from 'chai';
import sinon from 'sinon';
import Bridge from './bridge';

const assert = chai.assert;
const net = {};
const socket = {};

socket.on = sinon.spy();
net.connect = sinon.stub().returns(socket);
const sut = new Bridge({net});


describe('Bridge', () => {
	beforeEach(() => {
			
    });
	it('Should not be null', () => {
		assert.isNotNull(sut);
	});
});

