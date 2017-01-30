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
		
const sut = new CommandHandler({socket, wifi});

describe('Command Handler', () => {
	beforeEach(() => {
			
    });
	it('Should do bootstrap', () => {
		assert.isNotNull(sut);
	});
});