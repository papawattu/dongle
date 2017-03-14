import chai from 'chai';
import sinon from 'sinon';
import App from './app';

const assert = chai.assert;

const sut = new App();

describe('App', () => {
	beforeEach(() => {
			
    });
	it('Should not be null', () => {
		assert.isNotNull(sut);
	});
});

