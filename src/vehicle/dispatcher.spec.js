import chai from 'chai';
import sinon from 'sinon';
import Dispatcher from './dispatcher';
import chaiAsPromised from 'chai-as-promised';
 
chai.use(chaiAsPromised);

const assert = chai.assert;
const handler = {};
const client = {};
const sut = new Dispatcher({handler,client});

describe('Dispatcher', () => {
	beforeEach(() => {
			
    });
	it('Should not be null', () => {
		assert.isNotNull(sut);
	});
	it('Should send', () => {
		
	});
});
